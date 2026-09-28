import { IProject } from "@/models/Project";

export const DEFAULT_PROJECTS: IProject[] = [
  {
    _id: "default-1",
    title: "Enterprise ERP & Operational Platform",
    category: "Full-Stack",
    description:
      "A comprehensive enterprise resource planning system featuring real-time inventory tracking, multi-tenant role-based access control (RBAC), automated invoicing workflows, and dynamic analytical reporting dashboards.",
    tags: ["Java 21", "Spring Boot 3", "Next.js 16", "PostgreSQL", "Docker", "Apache Kafka"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://speshway.com",
    githubUrl: "https://github.com/jayanthchikkala",
    featured: true,
    order: 1,
  },
  {
    _id: "default-2",
    title: "Cloud-Native Microservices Suite",
    category: "Cloud & APIs",
    description:
      "Distributed microservices infrastructure with API gateway routing, distributed tracing with OpenTelemetry, circuit breaker patterns, and auto-scaling container deployments on AWS EKS.",
    tags: ["Spring Cloud", "Kubernetes", "AWS EKS", "Redis", "Docker", "Prometheus"],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://github.com/jayanthchikkala",
    githubUrl: "https://github.com/jayanthchikkala",
    featured: true,
    order: 2,
  },
  {
    _id: "default-3",
    title: "High-Performance Developer Portfolio & CMS",
    category: "Web Apps",
    description:
      "Modern full-stack portfolio with 3D hardware-accelerated interactive elements, real-time MongoDB synchronization, secure Cloudinary media integration, and an administrative control panel.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "MongoDB", "Cloudinary"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "#",
    githubUrl: "https://github.com/jayanthchikkala",
    featured: false,
    order: 3,
  },
  {
    _id: "default-4",
    title: "Real-Time Distributed Messaging & Event Engine",
    category: "Cloud & APIs",
    description:
      "High-throughput WebSocket messaging broker supporting group channels, end-to-end delivery acknowledgments, Redis Pub/Sub clustering, and persistent chat history in MongoDB.",
    tags: ["Java", "WebSocket", "Spring Boot", "Redis Pub/Sub", "MongoDB"],
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://github.com/jayanthchikkala",
    githubUrl: "https://github.com/jayanthchikkala",
    featured: false,
    order: 4,
  },
];
