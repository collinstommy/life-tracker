https://d1-tutorial.tomascollins.workers.dev/

Generate migration file
```
npm run db:migrate
```

Setup db (run migration)
```
wrangler d1 execute hello-world --local --file=./schema.sql
```

Run sql
```
wrangler d1 execute hello-world --local --command='SELECT * FROM score'
```

## ToDo

### Chores
- [x] put drizzle into middleware?
- [x] filter by day of the week
- [x] auth + login
- [x] validation for create entry and edit entry
- [ ] zod validation
- [ ] uuid for db primary key
- [x] use oob swap for deleting items?
- [ ] migrate to async hono v3

### Features

#### MVP
- [x] settings to add activities
- [ ] animate delete
- [ ] colors for mood
- [ ] save food
- [ ] deploy

#### Later
- [x] edit existing entry
- [x] delete entry
- [ ] sort activities by category on entry card
- [ ] add fitness tracking
- [ ] social activities, lunch, dinner, drinking, calling, hangout
- [ ] hard 75
- [ ] icons for activities
