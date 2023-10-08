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
- [ ] auth + login
- [ ] validation for create entry and edit entry

### Features
- [x] edit existing entry
- [ ] delete entry
- [ ] add fitness tracking
- [ ] sort activities by category on entry card
- [ ] settings to add activities
- [ ] food diary
- [ ] social activities, lunch, dinner, drinking, calling, hangout
- [ ] hard 75
