import {ToolCategory, ToolType} from "@/types/tool";
import {Image} from "@nextui-org/react";
import React from "react";

export const Tools: ToolType[] = [
  {
    key: "image-to-pdf",
    title: "Image to PDF",
    icon: <Image src="/icons/image-to-pdf.webp" width={35} />,
    description: "Convert your images to PDF format effortlessly using our intuitive online tool.",
    showFullDescription: true,
    href: "/image-to-pdf",
    isExternal: false,
    keywords: "image to pdf, convert image to pdf, image converter, pdf converter",
    category: [ToolCategory.PDF],
    updated: false,
    newPost: false,
  },

  {
    key: "merge-pdf",
    title: "Merge PDF",
    description: "Combine multiple PDFs into one unified document.",
    showFullDescription: true,
    icon: <Image src="/icons/merge-pdf.webp" width={35} />,
    href: "/tools/merge-pdf",
    isExternal: false,
    keywords:
      "merge pdf, combine pdf, pdf merger, merge pdf documents, pdf merge online, merge pdf files, pdf merge tool",
    category: [ToolCategory.PDF],
    updated: false,
    newPost: false,
  },
];

export const getToolByHref = (href: string): ToolType | undefined => {
  return Tools.find((tool) => tool.href === href);
};

// needed otherwise the server fails to start
React;
