
# GDSC Open Source Project Planning & Documentation Template

## Table of Contents
  <!-- * [Purpose](#purpose) -->
  * [:bulb: Project Description](#-bulb--project-description)
  * [:compass: Implementation Plan](#-compass--implementation-plan)
  * [:clipboard: Team Management](#-clipboard--team-management)
  * [:athletic_shoe: Sprint Planning](#-athletic-shoe--sprint-planning)

<!-- ## Purpose 
### What is this?
This template is meant to serve as a guideline for open source project leads planning, and documenting their projects, as well as managing their team of developers. You, as a lead, can begin filling out this project once you have a rough idea of what the project will be. Every project is different, so I'd like to emphasize that it is a guideline, and can be adapted and expanded upon to meet your project's needs. Every project should, however, abide by the scrum agile team development framework, and following this guideline will facilitate that. If you have any questions/comments about this document, please don't hesitate to contact me, @rawamily on discord. 

### Who's this for?
This document is for both the lead and developer's reference. Once this document is complete, it will be provided to the general open source applicants (i.e. your prospective developers), as they'll be choosing which project they want to commit to, so make sure to make it appealing! That being said you, as the lead, are free to continue making edits to this document throughout the projects timeline, and you likely will need to, however **please have it completed prior to the start of the project in September**. Planning early will make your job as a lead a lot easier during the semester as you balance this role with other commitments, so start as soon as you can!


### How should I fill it out?
It's recommended to follow the markdown template provided. You can copy the contents of this file and commit it to your project's repository, so that applicants, and eventually, your developers, will have easy access to it. Note that the actual guidelines start in the following section, [Project Desctiption](#project-description), so you shouldn't have this section, [Purpose](#purpose), in the final document. Each section/sub-section contains instructions for you as the lead to fill it out. All the instructions are italicized, and again, they shouldn't be in the final document so please comment them out or delete them. Some sections are prefilled, but feel free to edit them to your project's needs.  -->

## :bulb: Project Description
<!-- *Brief overview of the project, its objectives, and its significance. The list of objectives should briefly define **what** the project accomplishes. The list of stakeholders should briefly define **who** the main users/people affected by this project are. This section should provide context for the team, and should also provide them with any technical background information needed to understand the problem being addressed by your project. Feel free to include links/references to projects or whatever else that inspired you.* -->

DBAC and the Pulse is one of the impressive campus athletic centres and gyms in Canada. However, the student experience of visiting DBAC, achieving goals, and having fun with other sports and activities can still be improved. This being said, the **DBAC Companion App** aims to ease many inconveniences that may be faced by the athletes at DBAC, and streamline many other processes to maximize the benefit one can derive by visiting.

### Objectives
1. Help encourage McMaster students and other DBAC visitors to visit the Pulse, join classes, participate in sport, and potentially recieve physical rehabilitation
2. Make the platform accessible first as an elegant webapp that can be accesible through browser, with compatibility in mind
3. Collaborate with key stakeholders to ensure requirements are in-line with the DBAC Companion App mission of improving the experience of visiting and working at DBAC.

### Stakeholders

- Students visiting DBAC
- DBAC Employees
- Trainers and Coaches at DBAC


## :compass: Implementation Plan

### Project Timeline
<!-- *Describe the major project milestones that you will aim for over the course of the year. Milestones should be oriented around the level of completeness your project attains toward the end product. It's a good idea to have Milestone 1 be a minimum viable product, something that satisfies the main business logic of the product with minimal code, then work to improving the project through following milestones. That was you can insure a working product by the end of the year.* -->


- **Milestone 1 <ins>Date</ins> :** Set up the architecture necessary for each component of the web-application, along with a base front-end to allow for testing of each back-end component
    - We will be using the microservice architecture to easily organize the many different components of the webapp that will be necessary for its operation
- **Milestone 2 (MVP) <ins>Date</ins> :** Setup User Account functionality
    - User account creation, sign-in, and management
    - **Simple** - auxiliary parts of account can be achieved later.
- **Milestone 3 (MVP) <ins>Date</ins> :** Fully develop Pulse availability functionality
    - UI that allows users to declare usage (Setting sets left, toggling work-in, exercise choice)
    - Low-latency real-time database to manage data
    - Data handling from front-end to backend
- **Milestone 4 <ins>Date</ins> :** Fully develop platform to allow for chat for specific sports and activities
- **Milestone 5 <ins>Date</ins> :** Fully develop platform to allow DBAC coaches and instructors to schedule and manage classes

### Tech Stack
<!-- *Determine a list of options for your tech stack. Ideally at this point, you'd list multiple frameworks that you'd pick from later, after onboarding your developers, so that you know what your team mates are most comfortable/interested in working with.* -->
- **Frontend Framework:** [React Native, Tailwind]
- **Backend Framework:** [Node.js & Express.js]
- **Database:** [Firebase Realtime DB or Couchbase OSE, PostgreSQL]
- **Cloud** [Docker, GKE, Compute Engine, Cloud Storage]
- **Other Technologies/Libraries:**
  - Google SSO OAuth 2.0
  - Google Calendar API
  - Socket.io

### Project Structure 
*Describe the high-level structure of the project, including directories, modules, and how components/modules interact. For instance, you may need a frontend directory and a backend directory. In your backend directory you may have a designated module for different components of the project, etc. Keep it high level and don't include biolerplate. Include a diagram if you'd like!*

- /dev
  - /frontend
    - /src
    - /static
  - /backend
    - /services
### API Documentation
*Optional: Include some high-level descriptions of the APIs that will need to be developed. You can organize this however you'd like.*
- **API Endpoint:** [URL]
- **API Documentation Tool:** [e.g., Swagger, Postman]
  
### Testing & CI/CD
<!-- *Your project should have a formal testing plan that will complement the code acceptance of each pull request. The tests themselves may be written by your devs, but you should try to define a plan/framework for how they should write/execute their tests. It be great if you could integrate automated testing and deployment, but manual testing works as well. Describe the test plans, metrics/measures you'll use such as coverage, and tools such as specific testing frameworks that match your tech stack, automation tools like GitHub Actions, Jenkins, etc.* -->

JEST will be used as the testing framework to test our Javascript front-end and back-end.
### Hosting 
- **Application Hosting:** [e.g., GKE, GCP]
- **Database Hosting:** [e.g., Google Cloud Storage, Firebase Realtime DB] *highly cost dependent*

## :clipboard: Team Management

### Team Members
*For now, determine approximately how many developers and of what type you would need for your project. After recruitment and onboarding, list the names that will fulfill each role*
- **Scrum Master & Product Owner:** [Lead's Name]
- **Frontend Developers:**
  - [Name]
  - [Name]
- **Backend Developers:**
  - [Name]
  - [Name]
- **_Other Type_ Developers:**
  - [Name]
  - [Name]
  - [Name]
  


### Team Communication
*You should be meeting with your team mates weekly. For this section, document a meeting frequency for reviews and retrospectives. Times will be chosen after onboarding.*
- **Communication Platform:** Google Meet
- **Meeting Schedule:**
  - Sprint Review: [Time and Frequency] --Weekly
  - Sprint Retrospective: [Time and Frequency]
  - Other Meetings: [Specify]

### Roles and Responsibilities
*This section defines the responsibility of each role, you may edit to fit your project's needs.*

- **Scrum Master:**
  - Flush out project's boilerplate 
  - Assign tickets to developers
  - Facilitate scrum ceremonies (sprint reviews, retrospectives)
  - Remove impediments
- **Product Owner:**
  - Define product backlog 
  - Prioritize user stories
  - Accept/reject deliverables
- **Developers:**
  - Develop features through ticket completion
  - Create test cases to for feature/ticket acceptance
  - Thoroughly document code and features through pull requests and README docs
  - Execute tests
  - Report defects

### Collaboration Tools
<!-- *Pick a collaboration/organization tool that will be used to define your sprint timelines, including the milestones you defined earlier. You should be able to integrate GitHub issues into this tool, and it should be kept up to date over the course of the project [e.g., GitHub Projects, Kanban boards, etc.]* -->
 - Github Projects

### Code Acceptance: The Definition of Done
*You may edit the below DoD to match your project/preferences.*

Below we define the Definition of Done for this project, i.e. what needs to the included in a pull request for the pull request to be accepted by the Product Owner:
- Code Complete (satisfies feature associated to the ticket)
- Passed Code Review by Scrum Master
- Passed Unit Tests/Other testing developed for the feature
- Documentation Updated
- Ready to be integrated with Main Branch (no merge conflicts)



## :athletic_shoe: Sprint Planning
### High Level Goals for Each Sprint
*This section is meant to facilitate your future sprint planning, and allow you to estimate a more detailed project timeline. For each milestone you defined, break it up into 2-4 sprints, and describe the goals as well as expected duration for each sprint.*

#### <u>Milestone 1</u>

**Sprint 1**: [Description of what features will be achieved by the end of this sprint], [Expected length of sprint in weeks (Should be 1-2 weeks)]. 

**Sprint 2**: ...
 
#### <u>Milestone 2</u>

**Sprint 3**: ... 

...

### Sprint Planning 
*Below is a template for sprint planning for your future use. You can follow it as much as you'd like, so long as you're able to generate reasonably sized tickets for your members each sprint, and said tickets will bring you to your milestones by the target date you declared.*

*Some more resources for sprint Planning:*
- *[Atlassian: Sprint Planning](https://www.atlassian.com/agile/scrum/sprint-planning#:~:text=What%20is%20sprint%20planning%3F,with%20the%20whole%20scrum%20team.)*
- *[Scrum in 20 mins](https://www.youtube.com/watch?v=SWDhGSZNF9M&ab_channel=CodexCommunity)*

#### Sprint Duration
- _Sprint Length:_ [e.g., 2 weeks]
- _Start Date:_ [Date]
- _End Date:_ [Date]

#### High Level Sprint Goals
1. Goal 1
2. Goal 2
3. Goal 3

#### User Stories (Sample)

| ID   | User Story                                  | Priority | Story Points | Assignee |
|------|---------------------------------------------|----------|--------------|----------|
| US01 | As a [user role], I want to [feature]       | High     | 5            | Dev A    |
| US02 | As a [user role], I want to [feature]       | Medium   | 3            | Dev B    |
| US03 | As a [user role], I want to [feature]       | Low      | 2            | Dev C    |
