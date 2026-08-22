/**
 * Seed the Emeta database with products, blog posts and site content.
 * Run: npm run seed
 */
import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  console.log("Seeding database...");

  await prisma.globalSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  // Products (from design copy)
  const products = [
    {
      title: "WrenAI",
      slug: "wrenai",
      tags: "Generative BI Engine, AI, For Business",
      description:
        "Converting questions in plain language to governed SQL, charts, and insights. Compatible with 20+ data sources, suitable for both on-prem & cloud deployment.",
      sortOrder: 0,
    },
    {
      title: "BarkingDog",
      slug: "barkingdog",
      tags: "Generative BI Engine, AI, For Business",
      description:
        "Converting questions in plain language to governed SQL, charts, and insights. Compatible with 20+ data sources, suitable for both on-prem & cloud deployment.",
      sortOrder: 1,
    },
    {
      title: "Phison",
      slug: "phison",
      tags: "Data, AI, For Business",
      description:
        "Converting questions in plain language to governed SQL, charts, and insights. Compatible with 20+ data sources, suitable for both on-prem & cloud deployment.",
      sortOrder: 2,
    },
  ];
  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { title: p.title } });
    if (existing) await prisma.product.update({ where: { id: existing.id }, data: p });
    else await prisma.product.create({ data: p });
  }

  // Blog posts
  const posts = [
    {
      title: "Wren AI: Generative BI in Plain Language",
      slug: "wren-ai-generative-bi",
      excerpt:
        "Converting questions in plain language to governed SQL, charts, and insights. Compatible with 20+ data sources.",
      content:
        "Wren AI is a generative BI engine that lets you convert questions in plain language to governed SQL, charts, and insights.\n\nIt is compatible with 20+ data sources and suitable for both on-premise and cloud deployment.\n\nThis makes enterprise data exploration accessible to everyone in your organization, not just data engineers.",
      featured: true,
      published: true,
    },
    {
      title: "BarkingDog: Your AI Companion for Service Tasks",
      slug: "barkingdog-ai-companion",
      excerpt:
        "A versatile agentic AI solution suited for service tasks with multi-language and voice support.",
      content:
        "BarkingDog is a versatile agentic AI solution suited for service tasks.\n\nIt supports multiple languages and voice, and provides one-stop agent customization and management.\n\nTeams can deploy intelligent assistants to handle routine service work, freeing up human talent for higher-value tasks.",
      featured: true,
      published: true,
    },
    {
      title: "AI Amaze: One Stop Agent Customization Platform",
      slug: "ai-amaze-agent-platform",
      excerpt:
        "One stop agent customization and management platform for every business need.",
      content:
        "AI Amaze is a one-stop agent customization and management platform.\n\nIt makes it easy to build, deploy, and manage AI agents tailored to your business workflows.\n\nFrom customer support to internal operations, AI Amaze brings agentic automation within reach.",
      featured: false,
      published: true,
    },
    {
      title: "Phison Data Platform: Centralized AI Infrastructure",
      slug: "phison-data-platform",
      excerpt:
        "A centralized solution for infrastructure, applications, and everything in between.",
      content:
        "The Phison Data Platform provides a centralized solution for infrastructure, applications, and everything in between.\n\nIt increases deployment speeds, improves GPU utilization, and reduces the cost and complexity of running AI at scale.\n\nEnterprises across Indonesia rely on it as the foundation for their AI initiatives.",
      featured: false,
      published: true,
    },
    {
      title: "Bridging AI and Enterprise Software in Indonesia",
      slug: "bridging-ai-enterprise-indonesia",
      excerpt:
        "How PT Emeta Teknologi Indonesia bridges world-class AI and enterprise software for growing organizations.",
      content:
        "PT Emeta Teknologi Indonesia was founded to bridge the gap between world-class artificial intelligence and both growing organizations and established enterprises.\n\nWe distribute high-performance AI technologies and optimized cloud software across Indonesia.\n\nWith over 3000 channel partners, 35 strategic locations, and a presence in 300 cities, we bring enterprise AI within reach for businesses nationwide.",
      featured: false,
      published: true,
    },
  ];
  for (const p of posts) {
    const { featured, ...rest } = p;
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: { ...rest, featured },
      create: p,
    });
  }

  // Contact/settings from design copy + CDN asset keys
  await prisma.globalSettings.upsert({
    where: { id: 1 },
    update: {
      phoneDisplay: "+6280000005557",
      emailSupport: "info@emeta.co.id",
      officeAddress:
        "Ruko WTC Matahari No. 921, Jl. Raya Serpong, Kota Tangerang Selatan, Banten, 15326",
      heroImageUrl: "2026-08/emeta-hero-bg-511585cc.webp",
      logoWhiteUrl: "2026-08/emeta-logo-white-00264f74.webp",
      logoBlueUrl: "2026-08/emeta-logo-blue-e0df7022.webp",
      contactMapUrl: "2026-08/emeta-contact-map-4c31b637.webp",
    },
    create: { id: 1 },
  });

  console.log("\nSeed complete.");
  console.log("Global settings id=1 present.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
