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

### Infra
- [ ] e2e testing - playwright?

### Features

#### MVP
- [x] settings to add activities
- [ ] local vars to switch variables
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
