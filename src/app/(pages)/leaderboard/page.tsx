"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setRepos, setContributionsDict } from "@/store/features/leaderboard/leaderboard.slice";
import { ContributorInterface } from "@/data/GitHub";
import { Avatar, Group, ScrollArea, Select, Table, Text, Center, Loader } from "@mantine/core";
import classes from "./page.module.css";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_ORG = "fossuok";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const excludedRepos =
  process.env.NEXT_PUBLIC_EXCLUDED_REPOS?.split(",").map((repo) => repo.trim()) || [];

const ITEMS_PER_PAGE = 10;

const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
  const headers: Record<string, string> = GITHUB_TOKEN
    ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
    : {};

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { headers });
      if (response.ok) return response;
      if (response.status === 403) {
        console.warn("Rate limited. Retrying...");
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    } catch (error) {
      console.error(`Error on attempt ${attempt}:`, error);
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
  return null;
};

const LeaderBoard: React.FC = () => {
  const [selectedRepo, setSelectedRepo] = useState<string>("overall");
  const dispatch = useAppDispatch();
  const { repos, contributionsDict, loadingRepos } = useAppSelector((state) => state.leaderboard);

  const contributors = contributionsDict[selectedRepo] || [];
  const sortedContributors = [...contributors].sort((a, b) => b.contributions - a.contributions);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetchWithRetry(`${GITHUB_API_URL}/orgs/${GITHUB_ORG}/repos`);
        if (!response) return;

        const data = await response.json();
        dispatch(setRepos(data));

        const contributionsDict: Record<string, ContributorInterface[]> = {};
        contributionsDict["overall"] = [];

        for (const repo of data) {
          if (excludedRepos.includes(repo.name)) continue;

          const contributorsResponse = await fetchWithRetry(
            `${GITHUB_API_URL}/repos/${GITHUB_ORG}/${repo.name}/contributors`
          );
          if (!contributorsResponse) continue;

          const repoContributors = await contributorsResponse.json();
          contributionsDict[repo.name] = repoContributors;

          repoContributors.forEach((contributor: any) => {
            const existing = contributionsDict["overall"].find(
              (c) => c.login === contributor.login
            );
            if (existing) {
              existing.contributions += contributor.contributions;
            } else {
              contributionsDict["overall"].push({ ...contributor });
            }
          });
        }

        dispatch(setContributionsDict(contributionsDict));
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };

    fetchRepos();
  }, [dispatch]);

  const rows = sortedContributors.map((contributor) => (
    <Table.Tr key={contributor.login}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={26} src={contributor.avatar_url} radius="xl" />
          <Text size="sm" fw={500}>
            {contributor.login}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{contributor.contributions}</Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 mt-3">Leaderboard</h1>

        {/* Repository Selector */}
        <Select
          data={[
            { value: "overall", label: "Overall Contributions" },
            ...repos
              .filter((repo) => !excludedRepos.includes(repo.name))
              .map((repo) => ({ value: repo.name, label: repo.name })),
          ]}
          value={selectedRepo}
          onChange={(value) => setSelectedRepo(value || "overall")}
          placeholder="Select a repository"
          label="Repository"
          mb="lg"
          disabled={loadingRepos}
        />

        {/* Contributor List */}
        {loadingRepos ? (
          <Center>
            <Loader size="lg" />
          </Center>
        ) : (
          <ScrollArea>
            <Table miw={800} verticalSpacing="sm" striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Contributor</Table.Th>
                  <Table.Th>Contributions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default LeaderBoard;
