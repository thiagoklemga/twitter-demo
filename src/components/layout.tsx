import { type PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex justify-center">
      <div className=" w-full border-x border-slate-200  md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};
