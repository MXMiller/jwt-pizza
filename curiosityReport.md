# Automated Testing in Video Game Engines


## Why I chose this:
I got into computer science in high school because I wanted to make video games. AThe main way I know for testing video games is to just get people to either play them normally, or intentionally trying ot break it.  large part of this class has been related to automated testing, so I wanted to see if there where any tools for automated testing in video game engines. Unity and Unreal engine are the two most popular game development engines, so I'll be breifly going over each of their automated testing frameworks. 


## Unity Test Framework:
Unitys Test framework is a package that must be installed alongside Unity. It has two kinds of tests: Edit Mode and Play Mode. 
- Edit Mode lets you run tests on the tools you use in the game without running the game. This mode is used for unit tests, editor extension tests, and asset/scene validaiton tests. 
- Play Mode lets you run tests on the game itself while it's running. This mode is used for gameplay tests, integration tests, and performance tests. 

Code in Unity is contained and compiled in assemblies. Assemblies are folders that help games compile faster and make code more structured and reusable. 

These are the basic steps for creating a new test:
1. Open the Test Runner window in Unity. 
2. Select Edit Mode or Play Mode. 
3. Create a new test assembly folder and an assembly definition file to reference if you want to test anything outside this test assembly. 
4. Create your test scripts in inside that test folder and write the tests in C#. Using these you can run unit tests on different classes or functions, Unity has external libraries, similar to jest, like NSubstitute that alliow mocking objects or classes for your tests. 
5. Initilize the test. Play Mode tests start in a blank scene so you need to create new instances of environments, objects, and players before running the test. 
6. Manipulate the editor or player like an object. 
7. Use assert commands to check tests. 


## Unreal Automation Test Framework: 
Tests in Unreal can be written using normal C++ code, or using blueprints. Blueprints represent code as various nodes that can be connected to perform different functions, similar to code blocks in Scratch. 
The Unreal automation Test Framework includes multiple different user interfaces for testing different things in different ways. 
- Automation Driver: testing that simulate user input. 
- Automation Spec: testing that follows behavior driven development. 
- Functional Testing: testing level functionality. 
- Screenshot Comparison Tool: testing rendering and textures by comparing screenshots. 
- FBX Test Builder: testing FBX files used for 3D aniamtion. 
- Editor Testing With Blueprints: testing the unreal editor using blueprints. 
- Editor Testing with Scripts: testing the unreal editor using python scripts. 
- CQTest: helps simplify test code syntax. 

Unreal tests can be contained in plugins. These plugins lets you enable and disable different tests, store content ouside of the projects main folder, and choose to include them in compiled builds of the game. 

Due to the many different kinds of tests, there isn't one set of steps to create a test. Instead each type of test has it's own steps. 
- Automation Driver: 

    1. Enable automation driver by enabling it's module API. 
    2. Create new driver instance. 
    3. Find elements you want to interact with. 
    4. Perform and test the actions or sequences of actions you want. 
    5. Disable automation driver by disabling it's module API. 

- Automation Spec: testing that follow behavior driven development. 

    1. Define a Spec. 
    2. Define excpectations of the public API you're testing. 
    3. Run tests with those excpectations. 

- Functional Testing: testing level functionality. 

    1. Place functional test actor in the level. 
    2. Create expected object resutls to test against. 
    3. Create scripts for the actor to follow. 
    4. Run test scripts against expected results. 

- Screenshot Comparison Tool: testing rendering and textures by comparing screenshots. 

    1. Take screenshots of output during functional test. 
    2. Create screenshot actor. 
    3. Run more tests with actor. 
    4. Compare outputs. 
    
- FBX Test Builder: testing FBX files used for 3D aniamtion. 

    1. Enable FBXAutomationTestBuilder plugin. 
    2. Define a test plan of actions and expected results. 
    3. Run test. 
    
- Editor Testing With Blueprints: testing the unreal editor using blueprints. 

    1. Enable EditorTests plugin. 
    2. Create editor utility blueprint. 
    3. Automate testing with anotehr blueprint. 
    
- Editor Testing with Scripts: testing the unreal editor using python scripts. 

    1. Enable PythonAutomationTest plugin. 
    2. Create and run python tests. 


## Conclusion:
Before making this report I only knew about manual game testing. I did however know about tool assisted speedruns where players create a bot to beat the game with theoretically perfect execution. The idea of automating a test for a game isn't that far off. There where many more types of automated tests than I thoght there where. It will definitly be useful when I eventually try making my own videogame.