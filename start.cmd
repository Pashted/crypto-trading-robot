@echo off

if not exist node_modules goto install

start http://localhost:3000/
npm run start
pause
exit

:install
echo Starting installation process
npm install > ./install.log & npm run build >> ./install.log & start http://localhost:3000/ & npm run start

exit /B 1