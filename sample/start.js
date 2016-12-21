// 这是一个bug的演示代码
AssertTrue(VFS.Exists("/tools/start.js") == true, "start.js is not exist, before mount");
VFS.Mount("/", "D:\\");
AssertTrue(VFS.Exists("/tools/start.js") == true, "start.js is not exist, after mount");