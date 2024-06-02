"use client";

import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/react";
import { Logo } from "@/components/icons/logo";
import { subtitle, title } from "@/libs/primitives";

function Hero() {
  return (
    <main className="h-screen text-center  mt-24">
      <center>
        <Logo />
      </center>
      <h1 className={title()}>Your Online&nbsp;</h1>
      <br />
      <h1 className={title({ color: "green" })}>Utitlity Toolbox&nbsp;</h1>
      <h2
        className={subtitle({
          fullWidth: true,
          class: "text-center",
        })}
      >
        Fast, beautiful and modern tools for everyone.
      </h2>
      <Button
        as={Link}
        endContent={
          <span className="icon-[solar--arrow-right-bold-duotone] size-6"></span>
        }
        color="success"
        variant="ghost"
        href="/tools"
      >
        Browse All
      </Button>
    </main>
  );
}

export default Hero;
