Feature: Assign leave to user

  Scenario: Add Paid Leave
    Given Open COSEC Web
    When Login with user
      | username | password | Validation           |
      | sa       | admin    | Welcome System Admin |
