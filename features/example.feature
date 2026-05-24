Feature: Example page
  Scenario: Load example.com and verify its title
    Given I navigate to the example site
    Then the page title should contain "Example Domain"
