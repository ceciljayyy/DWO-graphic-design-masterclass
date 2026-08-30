import { buildStructuredData } from "@/lib/seo";

type StructuredDataProps = {
  pathname?: string;
};

export function StructuredData({ pathname = "/" }: StructuredDataProps) {
  const data = buildStructuredData(pathname);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
