## Deploy
Generate migration file
```
npm run db:generate
```

Setup db (run migration)
```
wrangler d1 execute life-tracker --file=./drizzle/<migration filename>.sql
```

Run sql
```
wrangler d1 execute life-tracker --command='SELECT * FROM score'
```

Deploy
```
npm run deploy
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

### Infra
- [ ] e2e testing - playwright?

### Features

#### MVP
- [x] settings to add activities
- [ ] local vars to switch variables
- [x] animate delete
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
