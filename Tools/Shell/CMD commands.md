

Terminal linux commands:
 To create a folder  
```bash  
mkdir folder_name  
```  
  
If you want to create a folder in a specific directory, navigate to that directory using the `cd` command first:  
```bash  
cd /path/to/your/directory  
mkdir MyFolder  
```  
  
You can also create nested folders by using the `-p` option:  
```bash  
mkdir -p parent_folder/child_folder  
```  
  
This will create both the parent and child folders if they do not already exist.  
  
  
### 1. Using `touch`  
The `touch` command is the simplest way to create an empty file:  
```bash  
touch filename.txt  
```  
This creates an empty file named `filename.txt`.  
  
### 2. Using `echo`  
You can create a file and add some text to it with the `echo` command:  
```bash  
echo "Hello, World!" > filename.txt  
```  
This creates a file named `filename.txt` containing the text "Hello, World!".  
  
### 3. Using `cat`  
You can also create a file using the `cat` command:  
```bash  
cat > filename.txt  
```  
After running this command, you can type your text. Press `Ctrl + D` to save and exit.  
  
### 4. Using `nano` or another text editor  
You can create and edit a file using a text editor like `nano`:  
```bash  
nano filename.txt  
```  
This opens the `nano` editor. After typing your content, press `Ctrl + X`, then `Y`, and `Enter` to save.  
  
### 5. Using `printf`  
For more complex file creation with formatting, you can use `printf`:  
```bash  
printf "Line 1\nLine 2\n" > filename.txt  
```  
  

  
  
  
### 1. Delete a File  
To delete a single file, use the `rm` command:  
```bash  
rm filename.txt  
```  
  
### 2. Delete a Folder  
To delete an empty folder, use the `rmdir` command:  
```bash  
rmdir folder_name  
```  
  
### 3. Delete a Folder with Files Inside  
To delete a folder and all its contents (including files and subfolders), use the `rm` command with the `-r` (recursive) option:  
```bash  
rm -r folder_name  
```  
  
### 4. Force Delete (Optional)  
If you want to delete without being prompted for confirmation, you can add the `-f` (force) option:  
```bash  
rm -rf folder_name  
```  
  
### Important Note  
Be very careful when using the `rm -rf` command, as it will permanently delete files and folders without any warning. Always double-check the folder or file name before executing the command.


You can run both commands in a single command line using `&&` or `&`, depending on your needs. 

### Using `&&`
This will run the second command only if the first command succeeds:

```bash
tsc runner.ts && bun runner.js
```

### Using `&`
This will run both commands concurrently, without waiting for the first to finish:

```bash
tsc runner.ts & bun runner.js
```

Choose the method that best suits your use case!



