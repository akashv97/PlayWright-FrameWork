Feature: Example page
  Scenario: Load example.com and verify its title
    Given I navigate to the example site
    Then the page title should contain "Example Domain"

  Scenario: Load naukri website
    Given I navigate to the naukri site
    And I gave my username and password
    And I get navigate to naukri landing page
