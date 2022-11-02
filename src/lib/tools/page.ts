import { getLatestTag } from "@lib/github/api";
import { getRawAssetFromRepo, getRawFileFromRepo } from "@lib/github/raw";
import { removeFromLast } from "@utils/index";
import localManifest from "manifest.json";

import { ASSETS_PATH, CONTENT_PATH, FORCE_TAG, TAG } from "./config";

export interface Route {
  title: string;
  subtitle?: string;
  section?: string;
  heading?: boolean;
  keywords?: string;
  icon?: string;
  open?: boolean;
  path?: string;
  routes?: Route[];
  updated?: boolean;
  newPost?: boolean;
  comingSoon?: boolean;
}

export interface RouteContext {
  parent?: Route;
  route?: Route;
  nextRoute?: Route;
  prevRoute?: Route;
}

export interface Carry {
  params: { slug: any };
}

export async function getCurrentTag(tag?: string) {
  if (tag) return tag;
  if (FORCE_TAG) return TAG;

  return getLatestTag();
}

export function addTagToSlug(slug: string, tag?: string) {
  return tag ? slug.replace("/docs", `/tools/tag/${tag}`) : slug;
}

export async function fetchRawDoc(doc: string, tag: string) {
  return await getRawFileFromRepo(`${CONTENT_PATH}${doc}`, tag);
}

export async function fetchDocsManifest(_tag: string) {
  return localManifest;
  // if (!isProd) return localManifest;

  // const res = await getRawFileFromRepo(
  //   `${CONTENT_PATH}/tools/manifest.json`,
  //   tag
  // );

  // return JSON.parse(res);
}

export function getRawAsset(doc: string, tag: string) {
  return getRawAssetFromRepo(`${ASSETS_PATH}${doc}`, tag);
}

export function findRouteByPath(
  path: string,
  routes: Route[]
): Route | null | undefined {
  for (const route of routes) {
    if (route.path && removeFromLast(route.path, ".") === path) {
      return route;
    }
    const childPath = route.routes ? findRouteByPath(path, route.routes) : null;

    if (childPath) return childPath;
  }
}

export function getPaths(
  nextRoutes: Route[],
  carry: Carry[] = [{ params: { slug: [] } }]
) {
  nextRoutes.forEach((route: Route) => {
    if (route.comingSoon) {
      return;
    }
    if (route.path) {
      carry.push(removeFromLast(route.path, ".") as Carry);
    } else if (route.routes) {
      getPaths(route.routes, carry);
    }
  });

  return carry;
}
