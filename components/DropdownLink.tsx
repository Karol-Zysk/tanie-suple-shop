import Link from "next/link";

export default function DropdownLink(props: {
  [x: string]: string;
  href: string;
  children: string;
}) {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <span {...rest}>{children}</span>
    </Link>
  );
}
