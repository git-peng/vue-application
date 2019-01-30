# BritePayment

This is a sample application to demonstrate front-end development proficiencies.  

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
