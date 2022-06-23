#/bin/bash

if [ -f ./ecom.socket ]
then  
    mv ./ecom.socket /etc/systemd/system

if [ -f /etc/systemd/system/ecom.socket ]
then  
    mv ./ecom.service /etc/systemd/system ; sudo systemctl enable ecom.service ; sudo systemctl start ecom.service
    
else
    echo "Ecom utility is not present"
fi

sudo systemctl status ecom