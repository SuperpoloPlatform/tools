@echo off
set /p var=请输入项目名字: 
echo 您输入的项目名字是%var% 
sppbuild --create=%var%

