FROM node:16.13.2-alpine
WORKDIR /code
COPY ["package.json", "yarn.lock", "./"]
RUN mkdir -p packages/common
COPY ./packages/common packages/common
RUN mkdir -p apps/web
COPY ./apps/web apps/web
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn install --frozen-lockfile
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
#RUN chown -R nextjs:nodejs code/apps/msite/.next
USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["yarn", "workspace", "@moneytracker/web", "dev"]
