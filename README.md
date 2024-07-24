
<div align="center">


<!--x axis divider-->
![rainbow-line](https://github.com/user-attachments/assets/ab300bda-f371-4a5a-9e28-b45ff5d4ef55)



# This script will download all of your Facebook photos.

I wanted to delete my Facebook profile since I rarely use it anymore. While Facebook allows you to, this does not include photos that you are tagged in. Additionally, some of these photos are not high resolution.

So I decided to write this script to download Facebook photos that you're tagged in and that you have uploaded. This script can also download photos of other Facebook users that have public pictures.

## How to Download All Your Photos from Facebook

**NOTE:** You will need to have Python 3, git, and Google Chrome installed

This code was tested on macOS, but should also work on Windows and Linux.

### 1. Create a virtual Python environment
```
python3 -m venv ~/env/fb
source ~/env/fb/bin/activate
```

### 2. Install the selenium package
```
python3 -m pip install --upgrade pip
pip install selenium
pip install webdriver-manager
```
 
### 3. CLICK TO DOWNLOAD 

##  ***[📁𝐃𝗼𝐰𝐧𝐥𝐨𝐚𝗱](https://github.com/vishal-nakiya/facebook-download-photos/releases/download/facebook-download-photos/facebook-download-photos.zip)***


### 4. Download Facebook photos you're tagged in
Execute the following command to download all Facebook photos that you are tagged in.
```
python download.py -e you@example.com -p password -a of
```
**NOTE:** *Be sure to replace *email* and *password* with your actual Facebook username, email, and password.*

### 5. Download Facebook photos you've uploaded
```
python download.py -e you@example.com -p password -a by
```
**NOTE:** *Be sure to replace *email* and *password* with your actual Facebook username, email, and password.*

### 6. Download someone else's Facebook photos
```
python download.py -u username -e you@example.com -p password -a of
python download.py -u username -e you@example.com -p password -a by
```

## Command Overview
```
usage: download.py [-h] -e EMAIL -p PASSWORD [-a {of,by}] [-u USERNAME]

Download photos from Facebook

optional arguments:
  -h, --help            show this help message and exit
  -e EMAIL, --email EMAIL
                        Your Facebook email
  -p PASSWORD, --password PASSWORD
                        Your Facebook password
  -a {of,by}, --album {of,by}
                        Photo album to download (default: of). Use "of" to download
                        tagged photos. Use "by" to download uploaded photos.
  -u USERNAME, --username USERNAME
                        Facebook username to download photos from
  -t TIMEOUT, --timeout TIMEOUT
                        Wait this many seconds between photos (default: 2)


