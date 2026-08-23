# DWO Graphic Design Masterclass

Premium registration and payment platform foundation for the DWO Graphic Design Masterclass.

This repository is currently scoped to Phase 1: project setup, clean architecture, Prisma/MySQL configuration, and development tooling. Registration flows, Paystack payment logic, and the admin dashboard will be added in later phases.

## Project Purpose

The application will eventually let prospective participants learn about the masterclass, register for the event, pay the fee through Paystack, and receive confirmation after successful payment. An internal admin dashboard will later support registration and payment management.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma ORM
- MySQL
- Paystack
- Hostinger for production hosting

## Local Setup

1. Install dependencies.
2. Copy `.env.example` to `.env.local` and fill in the required values.
3. Run the development server.

## Environment Variables

- `DATABASE_URL`
- `PAYSTACK_SECRET_KEY`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `NEXT_PUBLIC_APP_URL`

## Development Commands

- `npm run dev` - start the development server
- `npm run build` - build the application for production
- `npm run start` - run the production server locally
- `npm run lint` - run ESLint
- `npm run format` - format the project with Prettier
- `npm run prisma:generate` - generate the Prisma client
- `npm run prisma:format` - format the Prisma schema

## Repository Structure

- `src/app` - application routes and layouts
- `src/components` - reusable UI components
- `src/lib` - shared helpers and shared configuration
- `src/services` - service-layer contracts and integrations
- `src/types` - shared TypeScript types
- `prisma` - Prisma schema and future migrations