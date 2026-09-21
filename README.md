# Media One Digital — Website & Client Platform

## Project overview

Based on the **Media One Digital Website Structure** brief, we recommend a mobile-friendly platform that showcases the agency’s work and lets clients request quotes, pay invoices, track projects and approve deliverables in one place.

## Recommended technology stack

| Area | Recommended technology | Purpose |
| --- | --- | --- |
| Website & client portal | Next.js, React, TypeScript and Tailwind CSS | A responsive, visually engaging interface, with search-friendly public pages. |
| Backend | Laravel (PHP) | Central management of quotes, projects, approvals, invoices, payments and client access. |
| Database | PostgreSQL | Structured records for clients, projects, pricing, payments and rewards. |
| Staff dashboard & content | Filament for Laravel | A tailored admin area to manage website content and day-to-day client work. |
| File storage | Private Amazon S3 storage | Store briefs, design versions and final files, with controlled download access. |
| Background tasks | Laravel queues | Process email notifications, receipts and renewal reminders outside page requests. |
| Deployment | Managed cloud hosting and managed PostgreSQL | Separate staging and production environments, HTTPS, monitoring and automated backups. |

**Why this approach:** Next.js supports the presentation and search visibility needs of the public website. Laravel provides the foundation for the business workflows behind it. We recommend one central backend to keep development and ongoing maintenance manageable. See the official [Next.js](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Laravel](https://laravel.com/framework/docs/13.x/queues) and [Filament](https://filamentphp.com/docs/5.x/introduction/overview) documentation.

## Backend scope

- **Quotes:** Service selection, brief uploads and estimates calculated from staff-managed pricing rules; complex requests go to manual quotation.
- **Client portal:** Project status, versioned files, feedback, revision requests, recorded approvals and final downloads.
- **Billing:** Deposit and balance invoices, verified payment records, receipts, payment history and hosting/service renewal reminders.
- **Administration:** Manage services, packages, portfolio projects, team profiles, testimonials, articles and client accounts.
- **Access protection:** Separate client and staff permissions, private project files and an activity history for key actions.

## Payments & support

**PayChangu is the proposed payment gateway** for Malawi mobile money and card payments. Its documented methods include Airtel Money and TNM Mpamba. Merchant eligibility, settlement currencies, fees and automatic recurring billing must be confirmed before implementation. Renewals can initially use invoice payment links. See [supported payment methods](https://support.paychangu.com/hc/articles/24/supported-payment-methods).

For 24/7 support, integrate an AI chat service using approved FAQs, with human handover and after-hours enquiry capture. Project-status answers must require authenticated client access.

## Suggested delivery phases

1. **Website & enquiries:** Public pages, portfolio, packages, insights, content dashboard and quote requests.
2. **Client operations:** Instant estimates, client portal, file reviews, approvals, invoices and payments.
3. **Engagement & automation:** Media One Besties rewards, referral credits, AI support and service renewals.

**Before scheduling:** Confirm pricing rules, approval workflows, payment account readiness and launch priorities. Development, hosting, storage, email, AI usage and gateway fees should be budgeted separately. Timeline and cost follow the agreed scope.
