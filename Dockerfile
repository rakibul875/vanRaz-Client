# 1. Base image হিসেবে Node.js ব্যবহার করা
FROM node:18-alpine AS base

# 2. Dependencies install করার জন্য stage
FROM base AS deps
WORKDIR /app

# package.json এবং package-lock.json / yarn.lock কপি করা
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Build করার জন্য stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js telemetry বন্ধ রাখতে পারেন (Optional)
ENV NEXT_TELEMETRY_DISABLED 1

# প্রজেক্ট বিল্ড করা
RUN npm run build

# 4. Production run করার জন্য final image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Standalone output-এর জন্য permission সেট করা (Next.js config লাগবে)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.00"

CMD ["node", "server.js"]