Feature: Assign leave to user

    Scenario: Leave Credit Scenario for Period= Monthly, Credit Mode= Fixed, Leave Type= Paid Leave
    Given Open Cosec Web
    And Login with user
      | username | password | Validation           |
      | sa       | admin    | Welcome System Admin |
    And Delete user via API
      | UserID |
      | LMUr1  |
      | LMUr2  |
      | LMUr3  |
      | LMRic1 |
    And Create Leave
      | LeaveID | LeaveName       | LeaveType  | MinAlwAtATime | MaxAlwLimit | MaxAllLimitFor | MinAlwDur | MaxAlwDurPerApp | MaxAlwDurPerDay | Validation         |
      | CD      | LM_CD_PaidLeave | Paid Leave |           0.0 |        99.0 | Single App     |           |                 |                 | Saved Successfully |
    And Create Leave Group "LM_LeaveGrp_PaidLeave" with Pro-rata "False"
      | LeaveID |
      | CD      |
    And Create user from user configuration
      | userid | Active | ReportingGroup | LeaveGroup            | AtdEnable | AttendancePlc | ACSEnable | ESSEnable | ESSDetail | PunchMarkingviaESS | Validation         |
      | LMUr1  | True   |                | LM_LeaveGrp_PaidLeave | True      |               | True      | True      | True      | True               | Saved Successfully |
    When "Credit" Leave from Credit_Debit_Encashment page
      | Period  | Month | Year | LeaveID | CreditMode | CreditValue | AccrPlcName | SelectUsers | UserIDs | Validation         |
      | Monthly |     0 |    0 | CD      | Fixed      |           1 |             | User Wise   | LMUr1   | Saved Successfully |
    Then Verify Leave Balance in Leave Balance Page
      | UserID | LeaveName       | Period  | Month | Year | Opening | Credit | Debit | Encashment | Availed | Closing | Overflow |
      | LMUr1  | LM_CD_PaidLeave | Monthly |     0 |    0 |    0.00 |   1.00 |  0.00 |       0.00 |    0.00 |    1.00 |     0.00 |