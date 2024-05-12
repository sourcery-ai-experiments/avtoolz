"use client";
import {ThemeSwitch} from "@/components";
import {useCmdkStore} from "@/components/cmdk";
import {DocsSidebar} from "@/components/docs/sidebar";
import {GithubIcon, Logo, SearchLinearIcon} from "@/components/icons";
import {routes as manifest} from "@/config/routes";
import {siteConfig} from "@/config/site";
import {Route} from "@/libs/docs/page";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Kbd,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
  Spacer,
} from "@nextui-org/react";
import {ChevronDown} from "@nextui-org/shared-icons";
import {clsx} from "@nextui-org/shared-utils";
import {isAppleDevice} from "@react-aria/utils";
import {usePathname, useRouter} from "next/navigation";
import {FC, useEffect, useRef, useState} from "react";

export interface NavbarProps {
  routes: Route[];
  tag?: string;
  slug?: string;
}
export const Navbar: FC<NavbarProps> = ({routes, slug, tag}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false);
  const [commandKey, setCommandKey] = useState<"ctrl" | "command">("command");
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const cmdkStore = useCmdkStore();

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    setCommandKey(isAppleDevice() ? "command" : "ctrl");
  }, []);

  const handleOpenCmdk = () => {
    cmdkStore.onOpen();
  };

  const searchButton = (
    <Button
      aria-label="Quick search"
      className="text-sm font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20"
      endContent={
        <Kbd className="hidden py-0.5 px-2 lg:inline-block" keys={commandKey}>
          K
        </Kbd>
      }
      startContent={
        <SearchLinearIcon
          className="text-base text-default-400 pointer-events-none flex-shrink-0"
          size={18}
          strokeWidth={2}
        />
      }
      onPress={handleOpenCmdk}
    >
      Quick Search...
    </Button>
  );

  return (
    <NextUINavbar
      ref={ref}
      className={clsx({
        "z-[100001]": isMenuOpen,
      })}
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="" justify="start">
        <NavbarBrand>
          <Link
            aria-label="Home"
            className="flex justify-start items-center tap-highlight-transparent transition-opacity active:opacity-50"
            href="/"
            style={{textDecoration: "none"}}
            color="foreground"
          >
            <Logo className="max-w-28" size={26} />
            <Spacer x={1} />
            <h1 className="font-bold text-inherit">aVToolz</h1>
            <Spacer x={2} />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Link isBlock color="foreground" href="/tools">
            All Tools
          </Link>
        </NavbarItem>
        {manifest.routes.map((category, index) =>
          category.routes.length > 0 ? (
            <Dropdown key={index}>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                    endContent={<ChevronDown fill="currentColor" size={16} />}
                    radius="sm"
                    variant="light"
                  >
                    {category.title}
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                key={index}
                aria-label={category.title}
                className="w-[340px]"
                itemClasses={{
                  base: "gap-4",
                }}
              >
                {category.routes.map((tool, index) => (
                  <DropdownItem
                    onPress={() => router.push(tool.href)}
                    key={index}
                    startContent={tool.icon}
                  >
                    {tool.title}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          ) : null,
        )}
      </NavbarContent>
      <NavbarContent className="flex w-full gap-2 sm:hidden" justify="end">
        <NavbarItem className="flex h-full items-center">
          <ThemeSwitch />
          <Link isExternal aria-label="Github" className="p-1" href={siteConfig.links.github}>
            <GithubIcon className="text-default-600 dark:text-default-500" />
          </Link>
        </NavbarItem>

        <NavbarItem className="w-10 h-full">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="w-full h-full pt-1"
          />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex">
          <Link
            isExternal
            isBlock
            showAnchorIcon
            href={siteConfig.links.githubRoadmap}
            color="success"
          >
            Roadmap
          </Link>

          <Link
            isExternal
            isBlock
            showAnchorIcon
            href={siteConfig.links.githubIssues}
            color="danger"
          >
            Report Bugs
          </Link>
          <ThemeSwitch />
          <Link isExternal aria-label="Github" className="p-1" href={siteConfig.links.github}>
            <GithubIcon className="text-default-600 dark:text-default-500" />
          </Link>
        </NavbarItem>

        <NavbarItem className="hidden lg:flex">{searchButton}</NavbarItem>

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="hidden sm:flex lg:hidden ml-4"
        />
      </NavbarContent>

      <NavbarMenu>
        {/* <div className="ml-3"> */}
        <NavbarItem>
          <Link color="success" isBlock href="/tools">
            All Tools
          </Link>
          <Spacer y={2} />
          <Link
            isBlock
            color="success"
            isExternal
            href={siteConfig.links.githubRoadmap}
            showAnchorIcon
          >
            Roadmap
          </Link>
        </NavbarItem>

        {/* </div> */}
        <DocsSidebar className="mt-t" routes={[...routes]} slug={slug} tag={tag} />
      </NavbarMenu>
    </NextUINavbar>
  );
};
