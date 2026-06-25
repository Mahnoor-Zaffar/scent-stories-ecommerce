import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByHandle, getAllProductHandles } from "@/data/catalog";
import { generateProductJsonLd } from "@/lib/seo";
import ProductDetail from "@/components/pdp/ProductDetail";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  return getAllProductHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const item = getProductByHandle(handle);
  if (!item) return {};

  const { product } = item;
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: [{ url: product.image_url, width: 1200, height: 1600 }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const catalogItem = getProductByHandle(handle);

  if (!catalogItem) {
    notFound();
  }

  const { product, variants } = catalogItem;
  const jsonLd = generateProductJsonLd(product, variants[0].price);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail catalogItem={catalogItem} />
    </>
  );
}
