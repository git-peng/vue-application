# BritePayment

This is a sample application to demonstrate front-end development proficiencies created as part of an assignemnt for a developer position.

A live version of this app can be found here.

<https://britepayment.appspot.com/>

## How to run this app

You'll need to create a config.json file in the root directory with the following information.

    {
        "database": {
            "dbaddress": [mongodb address],
            "user": [database username],
            "password" [database password]
        }
    }

If you are grading this program as part of a job application, I will have provided a config file with the proper credentials.

To run this app locally, make sure npm is installed and run the following commands.

    git clone
    npm install

Once the config file is created, start the app.

    npm start

When running the app locally, you can populate the database with dummy data with the command

    npm upload-sample-data

### Application Questions

* How long did you spend on the test? Would you do anything differently if you had more time?

I spent roughly a week on the test.  If I had more time I would have taken more time organizing my code and making everything more modular.  At the time of submission, the app is what I would like to consider the minimum viable product.

* In what ways would you adapt your component so that it could be used in many different scenarios where a data table is required?

A few things would need to be refactored to make the component completely reusable.  For example, seperating the table itself from the search controls, and making the table information agnostic.  It wouldn't take very long to do so.

* What is your favorite CSS property? Why?

My favorite css property is display, particularly the display: flex value.  It makes responsive layouts very easy.  That being said I am starting to warm up to grid based layouts.

* What is your favorite modern Javascript feature? Why?

My current favorite Javascript feature would have to be destructuring. The following

    function({val1, val2}){
        console.log(val1, val2);
    }

is much more readable than

    funciton(obj){
        console.log(obj.val1, obj.val2);
    }

* What is your favorite third-party Vue.js library? Why?
