Kniffel - a browser game
========================
Play Yatzee in your browser. You can find the live version at [unpunk.de/kniffel](http://unpunk.de/kniffel).

1. Download
-----------
To download the complete code, type...
```sh
git clone https://github.com/bubens/Kniffel.git
```
If nothing else is provided, the files will be downloaded to `./Kniffel`

2. Install necessary components
-------------------------------
1. Change to the folder with the files.
2. To install necessary components to build a Kniffel-Machine, type...
```sh
npm install
```
[npm](https://www.npmjs.com/) should be installed of course.

3. Configure FTP
----------------
1. You need a running FTP-Server with PHP (>= 5.1) running on it. You figure that out by yourself.
2. Edit credentials in .ftppass.
3. Edit the gruntfile according to your ftp-needs. You figure that out by yourself.

4. Configure Database
---------------------
1. Do that, configure the database. You can start by editing `Kniffel/config/config.php`.
2. Prepare a database with all the necessary tables and rows and stuff. Since I highly doubt that anyone would really want to install this thing anywhere, I won't go into detail on that here. But in the highly unlikely case that there is need for that, 'hit me up' as they say. Maybe I can be of help.

5. Developer-/Test-Version of the Kniffel-Machine
-------------------------------------------------
1. To build a Developer-/Test Version (no js-minification), type...
```sh
grunt build-dev
```

6. Kniffel-Machine
-----------------------------------------
1. To build a Kniffel-Machine, type...
```sh
grunt build
```

7. Build and deploy/release at once
-----------------------------------
1. To deploy at dev version (no minification), type...
```sh
grunt test-deploy
```
2. To deploy the kniffel machine (incl. minification and stuff), type...
```sh
grunt release
```

8. Finaly
---------
1. Have fun!
