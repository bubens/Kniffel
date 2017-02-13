Kniffel - a browser game
========================
Play Yatzee in your browser. You can find the live version at [http://unpunk.de/kniffel|unpunk.de/kniffel].

1. Download
-----------
To download the complete code, type...
    git clone https://github.com/bubens/Kniffel.git
If nothing else is provided, the files will be downloaded to a folder called ```Kniffel/```

2. Install necessary components
-------------------------------
1. Change to the folder that contains the files. E.g.:
    cd Kniffel
2. To install necessary components to build a Kniffel-Machine, type...
    [sudo] npm install

3. Configure FTP
----------------
1. You need a running FTP-Server with PHP (>= 5.1) running on it. You figure that out by yourself.
2. Edit credentials in .ftppass.
3. Edit the gruntfile according to your ftp-needs. You figure that out by yourself.

4. Developer-/Test-Version of the Kniffel-Machine
-------------------------------------------------
1. To build a Developer-/Test Version (no js-uglyfication), type...
    grunt build-dev

5. Kniffel-Machine
-----------------------------------------
1. To build a Kniffel-Machine, type...
    grunt build

6. Build and deploy/release at once
-----------------------------------
1. To deploy at dev version (no uglyfication), type...
    grunt test-deploy
2. To deploy the kniffel machine (incl. ugliyfication and stuff), type...
    grunt release

7. Finaly
---------
1. Have fun!