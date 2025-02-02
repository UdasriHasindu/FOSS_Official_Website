"use client";

import { Box, Burger, Button, Divider, Drawer, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Theming, ThemedLogo } from "@/components/ThemePicker/Theming";
import Link from "next/link";
import classes from "./HeaderMegaMenu.module.css";

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  return (
    <Box pb={0} w={"100%"}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/*243- same size as the rightside */}
          <Box miw={243}>
            <ThemedLogo />
          </Box>
          <Group h="100%" gap={0} visibleFrom="md">
            <Link href="/" className={classes.link}>
              Home
            </Link>
            <Link href="/events" className={classes.link}>
              Events
            </Link>
            <Link href="/about" className={classes.link}>
              About
            </Link>
            <Link href="/blog" className={classes.link}>
              Blog
            </Link>
            <Link href="/leaderboard" className={classes.link}>
              Leaderboard
            </Link>
          </Group>

          <Group visibleFrom="md">
            <Button radius="xl">Open Dev Summit '25</Button>
            <Theming />
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="md"
          />
        </Group>
      </header>

      <Drawer.Root
        opened={drawerOpened}
        onClose={closeDrawer}
        offset={50}
        position="top"
        size="100%"
        transitionProps={{
          transition: "fade-down",
          duration: 200,
          timingFunction: "linear",
        }}
        hiddenFrom="md"
        zIndex={1000000}
      >
        <Drawer.Overlay backgroundOpacity={0.25} blur={30} />
        <Drawer.Content opacity={0.7} radius="md">
          <Drawer.Body pt={50}>
            <Link href="/" className={classes.link} onClick={toggleDrawer}>
              Home
            </Link>
            <Link
              href="/events"
              className={classes.link}
              onClick={toggleDrawer}
            >
              Events
            </Link>

            <Link href="/about" className={classes.link} onClick={toggleDrawer}>
              About
            </Link>
            <Link href="/blog" className={classes.link} onClick={toggleDrawer}>
              Blog
            </Link>
            <Link
              href="/leaderboard"
              className={classes.link}
              onClick={toggleDrawer}
            >
              Leaderboard
            </Link>

            <Divider my="sm" />

            <Group justify="center" grow px="md">
              <Button miw={100} radius="xl">
                Summit
              </Button>
              <Theming />
            </Group>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </Box>
  );
}
