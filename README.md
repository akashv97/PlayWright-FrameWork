# PlayWright-FrameWork

## Allure report

Run the Cucumber tests. The report is generated and opened automatically after the run:

```powershell
npm run test
```

The environment commands also open the report automatically:

```powershell
npm run test:qa1
npm run test:qa2
```

Generate the report separately from existing results:

```powershell
npm run allure:generate
```

Open the generated report:

```powershell
npm run allure:open
```

Allure result files are written to `allure-results` and the generated report is written to `allure-report`.