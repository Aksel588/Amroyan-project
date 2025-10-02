import React, { lazy, Suspense } from "react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import type { LucideProps } from "lucide-react";

const fallback = <div className="inline-block" style={{ width: 24, height: 24 }} />;

export interface DynamicIconProps extends Omit<LucideProps, "ref"> {
  name?: string; // accepts any string, we normalize to lucide kebab-case keys
}

function toKebab(input: string) {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

const DynamicIcon = ({ name = "calculator", ...props }: DynamicIconProps) => {
  const desired = toKebab(name || "calculator");
  const key = (desired in dynamicIconImports ? desired : "calculator") as keyof typeof dynamicIconImports;
  const importer = dynamicIconImports[key];
  const LucideIcon = lazy(importer);
  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

export default DynamicIcon;
