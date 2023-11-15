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

### Features

#### MVP
- [ ] settings to add activities
- [ ] colors for mood
- [ ] deploy

#### Later
- [x] edit existing entry
- [x] delete entry
- [ ] sort activities by category on entry card
- [ ] add fitness tracking
- [ ] food diary
- [ ] social activities, lunch, dinner, drinking, calling, hangout
- [ ] hard 75
- [ ] icons for activities
