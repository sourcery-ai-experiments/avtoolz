"use client";
import {Button, Link} from "@nextui-org/react";
import {ArrowRightIcon} from "@nextui-org/shared-icons";
import {Logo} from "./icons";
import {subtitle, title} from "./primitives";

function HeroX() {
  return (
    <main id="checl" className="h-screen text-center  mt-24">
      <center>
        <Logo />
      </center>
      <h1 className={title()}>Your Online&nbsp;</h1>
      <br />
      <h1 className={title({color: "green"})}>Utitlity Toolbox&nbsp;</h1>
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
        endContent={<ArrowRightIcon />}
        color="success"
        variant="ghost"
        href="/tools"
      >
        Browse All
      </Button>
    </main>
  );
}

export default HeroX;
