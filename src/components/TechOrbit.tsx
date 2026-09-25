"use client";

import React, { useEffect, useState } from "react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { GridPattern } from "@/components/ui/grid-pattern";
import {
  Sparkles,
  Server,
  Cpu,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==========================================
// 100% Authentic Official Vector Brand SVGs
// Perfectly calibrated for Light & Dark mode
// ==========================================
const TechIcons = {
  // 1. JAVA (Official Devicon Full Cup)
  java: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="Java">
      <path fill="#0074BD" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/><path fill="#EA2D2E" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"/><path fill="#0074BD" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"/><path fill="#EA2D2E" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"/><path fill="#0074BD" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"/>
    </svg>
  ),

  // 2. SPRING BOOT (Official Devicon)
  spring: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="Spring Boot">
      <path d="M116.452 6.643a59.104 59.104 0 01-6.837 12.136A64.249 64.249 0 0064.205-.026C28.984-.026 0 28.982 0 64.242a64.316 64.316 0 0019.945 46.562l2.368 2.1a64.22 64.22 0 0041.358 15.122c33.487 0 61.637-26.24 64.021-59.683 1.751-16.371-3.051-37.077-11.24-61.7zM29.067 111.17a5.5 5.5 0 01-4.269 2.034c-3.018 0-5.487-2.484-5.487-5.502 0-3.017 2.485-5.501 5.487-5.501 1.25 0 2.485.433 3.452 1.234 2.351 1.9 2.718 5.384.817 7.735zm87.119-19.238c-15.843 21.122-49.68 14.003-71.376 15.02 0 0-3.852.234-7.721.867 0 0 1.45-.617 3.335-1.334 15.226-5.301 22.43-6.335 31.685-11.086 17.427-8.869 34.654-28.274 38.24-48.463-6.637 19.422-26.75 36.11-45.077 42.895-12.557 4.635-35.238 9.136-35.238 9.136l-.917-.484c-15.442-7.518-15.91-40.977 12.157-51.78 12.291-4.735 24.048-2.134 37.323-5.302 14.175-3.367 30.568-14.004 37.238-27.874 7.471 22.19 16.46 56.932.35 78.405z" fill="#77bc1f"/>
    </svg>
  ),

  // 3. REACT (Official Devicon)
  react: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="React">
      <circle cx="64" cy="64" r="11.4" fill="#61DAFB"/>
      <path fill="#61DAFB" d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4z"/>
    </svg>
  ),

  // 4. NEXT.JS (Adaptive contrast circle with N)
  nextjs: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="Next.js">
      <circle cx="64" cy="64" r="62" className="fill-zinc-950 dark:fill-white" />
      <path className="fill-white dark:fill-zinc-950" d="M106.317 112.014 49.167 38.4H38.4v51.179h8.614v-40.24l52.54 67.884a64.216 64.216 0 0 0 6.763-5.209z" />
      <rect x="81.7" y="38.4" width="8.6" height="51.2" className="fill-white dark:fill-zinc-950" />
    </svg>
  ),

  // 5. TYPESCRIPT (Official Devicon)
  typescript: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="TypeScript">
      <rect width="128" height="128" rx="16" fill="#007ACC" />
      <path fill="#FFF" d="M75.35 65.8h11.85v9.45c-2.9-1.3-5.65-2-8.35-2-3.4 0-5.1 1.3-5.1 3.9 0 1.4.55 2.55 1.7 3.4 1.15.85 3.4 1.85 6.75 3 4.7 1.65 8.15 3.6 10.3 5.85 2.15 2.25 3.25 5.3 3.25 9.15 0 5.3-1.9 9.45-5.7 12.5-3.8 3.05-9.2 4.55-16.15 4.55-3.4 0-6.85-.4-10.3-1.25-3.45-.85-6.35-2.1-8.75-3.8l3.9-9.7c2.55 1.75 5.35 3.05 8.4 3.9 3.05.85 5.85 1.25 8.4 1.25 3.65 0 5.5-1.45 5.5-4.35 0-1.65-.65-2.95-2-3.9-1.3-.95-3.65-2-7-3.15-4.4-1.55-7.65-3.45-9.7-5.7-2.05-2.25-3.05-5.3-3.05-9.15 0-4.9 1.9-8.85 5.65-11.85 3.75-3 8.75-4.5 15-4.5zm-29.65 0v48.55h-11.8v-48.55h-17.6V55.5h47.45v10.3h-18.05z" />
    </svg>
  ),

  // 6. NODE.JS (Official Devicon)
  nodejs: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="Node.js">
      <path fill="#539E43" d="M64 0l55.426 32v64L64 128 8.574 96V32L64 0z" />
      <path fill="#333333" className="dark:fill-zinc-950" d="M64 10.667L17.809 37.333v53.334L64 117.333l46.191-26.666V37.333L64 10.667zm27.84 75.32l-7.387 4.267-20.453-11.8v-23.6l7.386-4.267v23.6l20.454 11.8zm-27.84-16.08l-20.453-11.8V34.507l7.386-4.267v23.6l20.454 11.8-7.387 4.267z" />
    </svg>
  ),

  // 7. POSTGRESQL (Official Devicon Slonik Elephant)
  postgresql: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="PostgreSQL">
      <path fill="#336791" d="M115.731 77.44c-13.925 2.873-14.882-1.842-14.882-1.842 14.703-21.816 20.849-49.51 15.545-56.287C101.924.823 76.875 9.566 76.457 9.793l-.135.024c-2.751-.571-5.83-.911-9.291-.967-6.301-.103-11.08 1.652-14.707 4.402 0 0-44.684-18.408-42.606 23.151.442 8.842 12.672 66.899 27.26 49.363 5.332-6.412 10.483-11.834 10.483-11.834 2.559 1.699 5.622 2.567 8.833 2.255l.25-.212c-.078.796-.042 1.575.1 2.497-3.758 4.199-2.654 4.936-10.167 6.482-7.602 1.566-3.136 4.355-.22 5.084 3.534.884 11.712 2.136 17.237-5.598l-.221.882c1.473 1.18 2.507 7.672 2.334 13.557-.174 5.885-.29 9.926.871 13.082 1.16 3.156 2.316 10.256 12.192 8.14 8.252-1.768 12.528-6.351 13.124-13.995.422-5.435 1.377-4.631 1.438-9.49l.767-2.3c.884-7.367.14-9.743 5.225-8.638l1.235.108c3.742.17 8.639-.602 11.514-1.938 6.19-2.871 9.861-7.667 3.758-6.408z" />
      <path fill="#fff" d="M75.957 122.307c-8.232 0-10.84-6.519-11.907-9.185-1.562-3.907-1.899-19.069-1.551-31.503a1.59 1.59 0 011.64-1.55 1.594 1.594 0 011.55 1.639c-.401 14.341.168 27.337 1.324 30.229 1.804 4.509 4.54 8.453 12.275 6.796 7.343-1.575 10.093-4.359 11.318-11.46.94-5.449 2.799-20.951 3.028-24.01a1.593 1.593 0 011.71-1.472 1.597 1.597 0 011.472 1.71c-.239 3.185-2.089 18.657-3.065 24.315-1.446 8.387-5.185 12.191-13.794 14.037-1.463.313-2.792.453-4 .454z" />
    </svg>
  ),

  // 8. MONGODB (Official Devicon)
  mongodb: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="MongoDB">
      <path fill="#13AA52" d="M64 0C64 0 24.78 35.84 24.78 76.54c0 30.52 24.78 51.46 39.22 51.46 14.44 0 39.22-20.94 39.22-51.46C103.22 35.84 64 0 64 0z" />
      <path fill="#116149" d="M64 128c-.06 0-14.78-20.94-14.78-51.46 0-40.7 14.78-76.54 14.78-76.54s14.78 35.84 14.78 76.54c0 30.52-14.72 51.46-14.78 51.46z" />
    </svg>
  ),

  // 9. DOCKER (Official Devicon)
  docker: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="Docker">
      <path fill="#2496ED" d="M124.945 52.484c-1.39-1.07-5.617-3.13-14.992-1.92-2.18-8.67-7.98-13.75-14.71-13.75-.82 0-1.63.08-2.42.23-1.08-9.06-8.24-14.39-16.14-14.39-.77 0-1.54.05-2.29.16-.17-.19-.34-.37-.53-.55-7.61-7.23-18.73-7.5-25.1-6.95-1.28.11-2.44.33-3.48.63v18.78h13.98v13.98H45.283V34.714H31.303v13.98H17.323V34.714H3.343v27.96h55.92V48.694h13.98v13.98h27.96v-13.98h13.98c5.44 0 9.8 1.95 12.38 5.48 2.22-1.01 4.54-1.59 6.84-1.69 1.13-.05 2.27.02 3.4.21-.57-.75-1.42-1.37-2.86-2.17zM11.703 76.634c4.66 17.65 19.86 31.81 39.52 36.87 23.96 6.17 50.1-1.01 67.57-18.57 5.09-5.12 9.07-11.23 11.75-17.92H1.423c2.72 6.87 6.36 13.06 10.28 19.62z" />
    </svg>
  ),

  // 10. KUBERNETES (Official Devicon)
  kubernetes: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="Kubernetes">
      <path fill="#326CE5" d="M64 0L8.85 31.84v64.32L64 128l55.15-31.84V31.84L64 0zm0 10.26l46.24 26.7v53.4L64 117.06 17.76 90.36v-53.4L64 10.26zm0 24.38a29.36 29.36 0 1 0 0 58.72 29.36 29.36 0 0 0 0-58.72zm0 10.26a19.1 19.1 0 1 1 0 38.2 19.1 19.1 0 0 1 0-38.2z" />
    </svg>
  ),

  // 11. APACHE KAFKA (Adaptive Fill)
  kafka: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="Apache Kafka">
      <path className="fill-zinc-900 dark:fill-zinc-100" d="M86.758 70.89c-4.992 0-9.465 2.208-12.528 5.68l-7.851-5.547a21.275 21.275 0 001.312-7.32c0-2.531-.46-4.95-1.27-7.203l7.837-5.488c3.062 3.457 7.523 5.652 12.5 5.652 9.207 0 16.703-7.48 16.703-16.672 0-9.195-7.496-16.672-16.703-16.672-9.211 0-16.707 7.477-16.707 16.672 0 1.645.25 3.23.699 4.735l-7.84 5.488a21.578 21.578 0 00-13.36-7.746v-9.43c7.567-1.586 13.27-8.293 13.27-16.312C62.82 7.53 55.324.055 46.117.055c-9.21 0-16.707 7.476-16.707 16.672 0 7.91 5.555 14.539 12.969 16.238v9.547c-10.117 1.773-17.84 10.59-17.84 21.191 0 10.652 7.797 19.5 17.992 21.211V95c-7.492 1.64-13.12 8.309-13.12 16.273 0 9.196 7.495 16.672 16.706 16.672 9.207 0 16.703-7.476 16.703-16.672 0-7.964-5.629-14.632-13.117-16.273V84.914a21.592 21.592 0 0013.133-7.625l7.902 5.586a16.45 16.45 0 00-.687 4.688c0 9.195 7.496 16.671 16.707 16.671 9.207 0 16.703-7.476 16.703-16.671 0-9.196-7.496-16.672-16.703-16.672zm0-38.984c4.465 0 8.097 3.63 8.097 8.086 0 4.453-3.632 8.082-8.097 8.082-4.469 0-8.102-3.629-8.102-8.082 0-4.457 3.633-8.086 8.102-8.086zm-48.742-15.18c0-4.456 3.632-8.081 8.101-8.081 4.465 0 8.098 3.625 8.098 8.082 0 4.457-3.633 8.082-8.098 8.082-4.469 0-8.101-3.625-8.101-8.082zm16.199 94.547c0 4.457-3.633 8.082-8.098 8.082-4.469 0-8.101-3.625-8.101-8.082 0-4.457 3.632-8.082 8.101-8.082 4.465 0 8.098 3.625 8.098 8.082zm-8.102-36.296c-6.226 0-11.293-5.059-11.293-11.274 0-6.219 5.067-11.277 11.293-11.277 6.23 0 11.297 5.058 11.297 11.277 0 6.215-5.066 11.274-11.297 11.274zm40.645 20.668c-4.469 0-8.102-3.625-8.102-8.082 0-4.458 3.633-8.083 8.102-8.083 4.465 0 8.097 3.625 8.097 8.082 0 4.458-3.632 8.083-8.097 8.083zm0 0" />
    </svg>
  ),

  // 12. REDIS (Official Devicon)
  redis: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="Redis">
      <path fill="#DC382D" d="M64 0L0 27.5l64 27.5 64-27.5L64 0zm0 36.5L17.5 18.5 64 2l46.5 16.5L64 36.5z" />
      <path fill="#A41E11" d="M0 30v42.5l64 27.5V57.5L0 30z" />
      <path fill="#B8271C" d="M64 57.5v42.5l64-27.5V30L64 57.5z" />
      <circle cx="42.5" cy="25" r="4" fill="#FFF" />
      <circle cx="85.5" cy="25" r="4" fill="#FFF" />
      <circle cx="64" cy="16" r="4" fill="#FFF" />
    </svg>
  ),

  // 13. AWS (Adaptive Text + Smile)
  aws: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="AWS">
      <path className="fill-zinc-900 dark:fill-zinc-100" d="M36.379 53.64c0 1.56.168 2.825.465 3.75.336.926.758 1.938 1.347 3.032.207.336.293.672.293.969 0 .418-.254.84-.8 1.261l-2.653 1.77c-.379.25-.758.379-1.093.379-.422 0-.844-.211-1.266-.59a13.28 13.28 0 0 1-1.516-1.98 34.153 34.153 0 0 1-1.304-2.485c-3.282 3.875-7.41 5.813-12.38 5.813-3.535 0-6.355-1.012-8.421-3.032-2.063-2.023-3.114-4.718-3.114-8.086 0-3.578 1.262-6.484 3.833-8.671 2.566-2.192 5.976-3.286 10.316-3.286 1.43 0 2.945.129 4.547.38a37.89 37.89 0 0 1 4.715 1.137v-3.79c0-2.863-.758-4.969-2.274-6.316-1.515-1.35-3.87-2.02-7.07-2.02-2.356 0-4.758.379-7.199 1.137a54.54 54.54 0 0 0-7.496 3.032c-.422.25-.8.379-1.137.379-.422 0-.758-.168-1.011-.504l-1.852-2.441c-.254-.336-.379-.715-.379-1.094 0-.379.168-.719.504-1.012 2.61-2.02 5.559-3.578 8.84-4.672 3.285-1.094 6.781-1.64 10.488-1.64 5.473 0 9.684 1.347 12.633 4.043 2.945 2.695 4.422 6.738 4.422 12.128v17.43zm-7.664-5.559a22.23 22.23 0 0 0-3.621-.844 26.69 26.69 0 0 0-4.043-.297c-2.441 0-4.293.59-5.559 1.77-1.262 1.179-1.894 2.738-1.894 4.671 0 1.856.59 3.286 1.77 4.297 1.179 1.012 2.82 1.516 4.925 1.516 2.02 0 3.79-.422 5.305-1.262 1.516-.844 2.567-2.066 3.117-3.664v-6.187z" />
      <path fill="#FF9900" d="M116.59 86.648C101.43 97.809 81.387 103.875 62.016 103.875c-27.114 0-51.536-10.152-70.02-27.117-1.43-1.348-.168-3.199 1.516-2.191 19.871 11.789 43.617 18.863 68.504 18.863 17.176 0 36.125-4.465 52.883-13.727 2.441-1.347 4.547 1.852 1.691 6.945z" />
      <path fill="#FF9900" d="M121.727 79.574c-1.938-2.441-12.8-1.179-17.766-.59-1.515.168-1.765-1.094-.422-2.02 8.672-6.063 22.82-4.293 24.504-2.274 1.684 2.02-4.461 15.66-12.633 22.313-1.261 1.011-2.437.503-1.851-.844 1.933-4.547 6.23-14.144 8.168-16.585z" />
    </svg>
  ),

  // 14. GIT (Official Devicon)
  git: (
    <svg viewBox="0 0 128 128" className="h-full w-full object-contain" aria-label="Git">
      <path fill="#F05032" d="M125.7 58.15L69.85 2.3c-3.07-3.07-8.05-3.07-11.7 0L46.35 14.1l16.35 16.35a9.8 9.8 0 0 1 12.4 12.45l15.75 15.75a9.8 9.8 0 1 1-5.85 5.8l-14.65-14.65v21.45a9.8 9.8 0 1 1-8.25 0V49.05a9.8 9.8 0 0 1-5.25-12.85L35.45 19.85 2.3 53a9.8 9.8 0 0 0 0 11.7l55.85 55.85c3.07 3.07 8.05 3.07 11.7 0l55.85-55.85c3.07-3.07 3.07-8.05 0-11.55z" />
    </svg>
  ),
};

interface TechItem {
  id: string;
  name: string;
  category: string;
  tier: 1 | 2 | 3;
  tierName: string;
  color: string;
  icon: React.ReactNode;
}

const innerTechItems: TechItem[] = [
  { id: "java", name: "Java", category: "Core Backend", tier: 1, tierName: "Inner Orbit", color: "#0074BD", icon: TechIcons.java },
  { id: "spring", name: "Spring Boot", category: "Microservices", tier: 1, tierName: "Inner Orbit", color: "#6DB33F", icon: TechIcons.spring },
  { id: "postgresql", name: "PostgreSQL", category: "Relational DB", tier: 1, tierName: "Inner Orbit", color: "#336791", icon: TechIcons.postgresql },
  { id: "nodejs", name: "Node.js", category: "Server Runtime", tier: 1, tierName: "Inner Orbit", color: "#539E43", icon: TechIcons.nodejs },
];

const middleTechItems: TechItem[] = [
  { id: "react", name: "React.js", category: "Reactive UI", tier: 2, tierName: "Middle Orbit", color: "#61DAFB", icon: TechIcons.react },
  { id: "nextjs", name: "Next.js 16", category: "Full-Stack Web", tier: 2, tierName: "Middle Orbit", color: "#000000", icon: TechIcons.nextjs },
  { id: "typescript", name: "TypeScript", category: "Type-Safety", tier: 2, tierName: "Middle Orbit", color: "#007ACC", icon: TechIcons.typescript },
  { id: "mongodb", name: "MongoDB", category: "Document Store", tier: 2, tierName: "Middle Orbit", color: "#13AA52", icon: TechIcons.mongodb },
  { id: "redis", name: "Redis", category: "In-Memory Cache", tier: 2, tierName: "Middle Orbit", color: "#DC382D", icon: TechIcons.redis },
];

const outerTechItems: TechItem[] = [
  { id: "docker", name: "Docker", category: "Containers", tier: 3, tierName: "Outer Orbit", color: "#2496ED", icon: TechIcons.docker },
  { id: "kubernetes", name: "Kubernetes", category: "Orchestration", tier: 3, tierName: "Outer Orbit", color: "#326CE5", icon: TechIcons.kubernetes },
  { id: "kafka", name: "Apache Kafka", category: "Event Streams", tier: 3, tierName: "Outer Orbit", color: "#E05A47", icon: TechIcons.kafka },
  { id: "aws", name: "AWS Cloud", category: "Cloud Platform", tier: 3, tierName: "Outer Orbit", color: "#FF9900", icon: TechIcons.aws },
  { id: "git", name: "Git", category: "Version Control", tier: 3, tierName: "Outer Orbit", color: "#F05032", icon: TechIcons.git },
];

export default function TechOrbit() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTier, setActiveTier] = useState<number | null>(null);
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [rotationMode, setRotationMode] = useState<"bidirectional" | "clockwise" | "counter">("bidirectional");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive orbit radii: Compact and balanced on 2-column desktop and mobile
  const innerRadius = isMobile ? 65 : 90;
  const middleRadius = isMobile ? 116 : 160;
  const outerRadius = isMobile ? 165 : 230;
  const iconSize = isMobile ? 36 : 46;

  // When ANY icon is hovered, or manually toggled, pause all orbits completely to prevent flickering
  const isPaused = isManuallyPaused || hoveredTech !== null;
  const currentActiveTier = hoveredTech ? hoveredTech.tier : activeTier;

  // Render individual orbiting tech item with floating tooltip badge
  const renderTechIcon = (item: TechItem) => {
    const isHovered = hoveredTech?.id === item.id;

    return (
      <div
        key={item.id}
        onMouseEnter={() => setHoveredTech(item)}
        onMouseLeave={() => setHoveredTech(null)}
        className="group/tech relative flex items-center justify-center cursor-pointer w-full h-full select-none"
        role="button"
        tabIndex={0}
        aria-label={item.name}
      >
        {/* Floating Tooltip displaying what icon is hovered - Fixed z-[100] & elevated hierarchy */}
        {isHovered && (
          <div className="absolute -top-13 left-1/2 -translate-x-1/2 pointer-events-none z-[100] animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center drop-shadow-2xl">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/98 dark:bg-zinc-900/98 text-white border shadow-2xl backdrop-blur-md whitespace-nowrap"
              style={{ borderColor: item.color }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-bold text-white tracking-wide">{item.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                &bull; {item.category}
              </span>
            </div>
            {/* Caret Arrow */}
            <div
              className="w-2.5 h-2.5 -mt-1.5 rotate-45 bg-zinc-950/98 dark:bg-zinc-900/98 border-r border-b"
              style={{ borderColor: item.color }}
            />
          </div>
        )}

        {/* Outer Icon Bubble - Clean crisp background in both Light & Dark modes */}
        <div
          className={cn(
            "flex items-center justify-center rounded-full transition-all duration-300",
            "bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-700/80 shadow-md",
            isHovered
              ? "scale-125 ring-2 ring-offset-2 ring-offset-[var(--background)] shadow-2xl z-50"
              : hoveredTech !== null
              ? "opacity-35 scale-95" // Dim non-hovered icons so the active icon & badge shine without interference!
              : "hover:scale-115 hover:border-amber-500/70"
          )}
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            borderColor: isHovered ? item.color : undefined,
            boxShadow: isHovered ? `0 0 25px ${item.color}90` : undefined,
          }}
        >
          {/* Inner SVG container: 68% size gives ideal breathing room with zero edge clipping */}
          <div className="w-[68%] h-[68%] flex items-center justify-center">
            {item.icon}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full bg-[var(--background)] py-14 sm:py-18 lg:py-20 overflow-hidden border-t border-[var(--border)]/40">
      {/* Interactive Dash Grid Layer with All Animations */}
      <GridPattern
        width={40}
        height={40}
        strokeDasharray="4 2"
      />

      {/* Background Ambient Radial Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-3xl opacity-80" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl xl:max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* =========================================================================
              LEFT SECTION: Unique Description of the Tools (lg:col-span-6)
              ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col space-y-4 sm:space-y-5">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shadow-2xs w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full Stack Architecture</span>
            </div>

            {/* Title & Introduction */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
                Java &amp; MERN Ecosystem
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted-fg)] leading-relaxed">
                An interconnected architecture engineered for resilient high-throughput enterprise systems, modern responsive interfaces, distributed event streams, and cloud automation.
              </p>
            </div>

            {/* 3 Unique Architectural Tool Cards */}
            <div className="space-y-3 pt-1">
              {/* Tier 1: Core Backend & Enterprise */}
              <div
                onMouseEnter={() => setActiveTier(1)}
                onMouseLeave={() => setActiveTier(null)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md cursor-pointer ${
                  currentActiveTier === 1
                    ? "border-amber-500/80 bg-[var(--card-bg)]/90 shadow-lg shadow-amber-500/15 scale-[1.01]"
                    : "border-[var(--border)] bg-[var(--card-bg)]/55 hover:bg-[var(--card-bg)]/75 hover:border-amber-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Server className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      Enterprise Java &amp; Relational Core
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                    Inner Orbit
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[var(--muted-fg)] leading-relaxed pl-9">
                  Powered by <span className={hoveredTech?.id === "java" ? "font-bold text-amber-500 underline" : "font-semibold text-[var(--foreground)]"}>Java</span> and <span className={hoveredTech?.id === "spring" ? "font-bold text-amber-500 underline" : "font-semibold text-[var(--foreground)]"}>Spring Boot</span> microservices for transactional workflows, coupled with <span className={hoveredTech?.id === "postgresql" ? "font-bold text-amber-500 underline" : "font-semibold text-[var(--foreground)]"}>PostgreSQL</span> for strict ACID compliance and <span className={hoveredTech?.id === "nodejs" ? "font-bold text-amber-500 underline" : "font-semibold text-[var(--foreground)]"}>Node.js</span> asynchronous worker runtimes.
                </p>
                <div className="flex items-center gap-1.5 pl-9 pt-2 text-[10px] text-[var(--muted-fg)]">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span>Spring Data JPA &bull; Hibernate &bull; RESTful Microservices &bull; JWT Auth</span>
                </div>
              </div>

              {/* Tier 2: MERN & Modern Web Architecture */}
              <div
                onMouseEnter={() => setActiveTier(2)}
                onMouseLeave={() => setActiveTier(null)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md cursor-pointer ${
                  currentActiveTier === 2
                    ? "border-cyan-500/80 bg-[var(--card-bg)]/90 shadow-lg shadow-cyan-500/15 scale-[1.01]"
                    : "border-[var(--border)] bg-[var(--card-bg)]/55 hover:bg-[var(--card-bg)]/75 hover:border-cyan-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      Full-Stack MERN &amp; Next.js
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
                    Middle Orbit (Reverse)
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[var(--muted-fg)] leading-relaxed pl-9">
                  Interactive web applications built using <span className={hoveredTech?.id === "react" ? "font-bold text-cyan-500 underline" : "font-semibold text-[var(--foreground)]"}>React.js</span> &amp; <span className={hoveredTech?.id === "nextjs" ? "font-bold text-cyan-500 underline" : "font-semibold text-[var(--foreground)]"}>Next.js 16</span> server components, strictly typed via <span className={hoveredTech?.id === "typescript" ? "font-bold text-cyan-500 underline" : "font-semibold text-[var(--foreground)]"}>TypeScript</span>, with flexible <span className={hoveredTech?.id === "mongodb" ? "font-bold text-cyan-500 underline" : "font-semibold text-[var(--foreground)]"}>MongoDB</span> and low-latency in-memory <span className={hoveredTech?.id === "redis" ? "font-bold text-cyan-500 underline" : "font-semibold text-[var(--foreground)]"}>Redis</span> caching.
                </p>
                <div className="flex items-center gap-1.5 pl-9 pt-2 text-[10px] text-[var(--muted-fg)]">
                  <CheckCircle2 className="h-3 w-3 text-cyan-500 shrink-0" />
                  <span>Turbopack &bull; Server Actions &bull; Redis Cache &bull; Tailwind CSS</span>
                </div>
              </div>

              {/* Tier 3: Cloud, Event Streams & DevOps */}
              <div
                onMouseEnter={() => setActiveTier(3)}
                onMouseLeave={() => setActiveTier(null)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md cursor-pointer ${
                  currentActiveTier === 3
                    ? "border-emerald-500/80 bg-[var(--card-bg)]/90 shadow-lg shadow-emerald-500/15 scale-[1.01]"
                    : "border-[var(--border)] bg-[var(--card-bg)]/55 hover:bg-[var(--card-bg)]/75 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Cloud className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      Distributed Cloud &amp; Event Streams
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                    Outer Orbit
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[var(--muted-fg)] leading-relaxed pl-9">
                  Event-driven pub/sub data streaming with <span className={hoveredTech?.id === "kafka" ? "font-bold text-emerald-500 underline" : "font-semibold text-[var(--foreground)]"}>Apache Kafka</span>, containerized with <span className={hoveredTech?.id === "docker" ? "font-bold text-emerald-500 underline" : "font-semibold text-[var(--foreground)]"}>Docker</span>, automated via <span className={hoveredTech?.id === "kubernetes" ? "font-bold text-emerald-500 underline" : "font-semibold text-[var(--foreground)]"}>Kubernetes</span> cluster orchestration, and managed on <span className={hoveredTech?.id === "aws" ? "font-bold text-emerald-500 underline" : "font-semibold text-[var(--foreground)]"}>AWS</span> cloud infrastructure.
                </p>
                <div className="flex items-center gap-1.5 pl-9 pt-2 text-[10px] text-[var(--muted-fg)]">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span>Kafka Brokers &bull; Multi-Stage Docker &bull; K8s Pods &bull; AWS S3/EC2</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT SECTION: Transparent Orbiting Circles Floating on Grid (lg:col-span-6)
              ========================================================================= */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            {/* Interactive Control Pill Bar */}
            <div className="w-full flex items-center justify-between gap-2 mb-2 px-3 z-30">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setRotationMode((prev) =>
                      prev === "bidirectional"
                        ? "clockwise"
                        : prev === "clockwise"
                        ? "counter"
                        : "bidirectional"
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border border-[var(--border)] bg-[var(--card-bg)]/80 text-[var(--foreground)] hover:border-amber-500/60 shadow-xs transition-colors cursor-pointer"
                  title="Toggle Orbit Rotation Direction"
                >
                  <RefreshCw className="h-3 w-3 text-amber-500" />
                  <span>Orbit:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 capitalize">
                    {rotationMode === "bidirectional" ? "Bidirectional (Opposite)" : rotationMode}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsManuallyPaused((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border border-[var(--border)] bg-[var(--card-bg)]/80 text-[var(--foreground)] hover:border-amber-500/60 shadow-xs transition-colors cursor-pointer"
                  title={isManuallyPaused ? "Resume rotation" : "Pause rotation"}
                >
                  {isManuallyPaused ? (
                    <>
                      <Play className="h-3 w-3 text-emerald-500" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-3 w-3 text-amber-500" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Indicator / Active Tool announcement */}
              <div className="text-[11px] text-[var(--muted-fg)] hidden sm:flex items-center gap-1.5">
                {hoveredTech ? (
                  <span className="flex items-center gap-1.5 text-[var(--foreground)] font-semibold animate-in fade-in duration-200">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: hoveredTech.color }} />
                    <span>{hoveredTech.name}</span>
                  </span>
                ) : (
                  <>
                    <span className={`h-2 w-2 rounded-full ${isPaused ? "bg-amber-500" : "bg-emerald-500 animate-pulse"}`} />
                    <span>{isPaused ? "Rotation Paused" : "Hover icon to inspect"}</span>
                  </>
                )}
              </div>
            </div>

            {/* Transparent Orbiting Circles Container */}
            <div className="relative flex h-[390px] sm:h-[470px] lg:h-[550px] w-full items-center justify-center select-none bg-transparent">
              {/* Central Sun / Anchor Hub - z-20 (Orbit items with z-50 stack above this) */}
              <div className="relative z-20 flex flex-col items-center justify-center">
                {/* Pulsing ring aura */}
                <div
                  className="absolute -inset-4 rounded-full blur-md animate-pulse pointer-events-none transition-colors duration-500"
                  style={{
                    backgroundColor: hoveredTech
                      ? `${hoveredTech.color}35`
                      : "rgba(245, 158, 11, 0.2)",
                  }}
                />

                <div
                  className="relative flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-2xl border-2 shadow-lg backdrop-blur-xl transition-all duration-300 select-none bg-white/95 dark:bg-zinc-900/95"
                  style={{
                    borderColor: hoveredTech ? hoveredTech.color : "rgba(245, 158, 11, 0.6)",
                    boxShadow: hoveredTech
                      ? `0 0 30px ${hoveredTech.color}60`
                      : "0 10px 25px -5px rgba(245, 158, 11, 0.2)",
                  }}
                >
                  {hoveredTech ? (
                    <div className="flex flex-col items-center justify-center p-1 text-center animate-in fade-in zoom-in-75 duration-200">
                      <div className="size-7 sm:size-8 flex items-center justify-center mb-0.5">
                        {hoveredTech.icon}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-black tracking-tight text-[var(--foreground)] leading-none text-center px-0.5">
                        {hoveredTech.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center leading-none text-center">
                      <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-[var(--foreground)]">FULL</span>
                      <span className="text-[12px] sm:text-xs font-black tracking-wider text-amber-500">STACK</span>
                    </div>
                  )}
                </div>
              </div>

              {/* INNER ORBIT: Core Backend, Java & Relational DB */}
              {/* When hoveredTech is in Tier 1, this orbit is elevated to zIndex 50 (above Middle & Outer orbits) */}
              <OrbitingCircles
                radius={innerRadius}
                duration={22}
                reverse={rotationMode === "counter"}
                paused={isPaused}
                zIndex={hoveredTech?.tier === 1 ? 50 : 10}
                iconSize={iconSize}
                className={cn(
                  "transition-all duration-300",
                  currentActiveTier === 1 && "ring-2 ring-amber-500/50"
                )}
              >
                {innerTechItems.map(renderTechIcon)}
              </OrbitingCircles>

              {/* MIDDLE ORBIT: Modern MERN, React, Next.js & Full-Stack */}
              {/* When hoveredTech is in Tier 2, this orbit is elevated to zIndex 50 */}
              <OrbitingCircles
                radius={middleRadius}
                duration={28}
                reverse={rotationMode === "bidirectional" || rotationMode === "counter"}
                paused={isPaused}
                zIndex={hoveredTech?.tier === 2 ? 50 : 10}
                iconSize={iconSize}
                className={cn(
                  "transition-all duration-300",
                  currentActiveTier === 2 && "ring-2 ring-cyan-500/50"
                )}
              >
                {middleTechItems.map(renderTechIcon)}
              </OrbitingCircles>

              {/* OUTER ORBIT: Cloud, Distributed Systems & DevOps */}
              {/* When hoveredTech is in Tier 3, this orbit is elevated to zIndex 50 */}
              <OrbitingCircles
                radius={outerRadius}
                duration={36}
                reverse={rotationMode === "counter"}
                paused={isPaused}
                zIndex={hoveredTech?.tier === 3 ? 50 : 10}
                iconSize={iconSize}
                className={cn(
                  "transition-all duration-300",
                  currentActiveTier === 3 && "ring-2 ring-emerald-500/50"
                )}
              >
                {outerTechItems.map(renderTechIcon)}
              </OrbitingCircles>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
