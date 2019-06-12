# -*- coding:utf-8 -*-
# encoding:utf-8

import os,sys

print(os.getcwd())

for arg in sys.argv:
    print(arg)

filepath = input("请拖动要加密的js文件到此处\n")
# print(filepath)

def isHaveChar(str,start,end):
    b = False
    s2 = str[start:end]
    # s2 = bytes(s,encoding='unicode_escape')
    for i in range(len(s2)):
        istr = s2[i]
        bspace = istr.isspace()
        # print("isHaveChar istr:["+istr+"] isspace?:"+repr(bspace))
        if(not bspace):
            b = True
            break

    return b


def isLineComment(line):

    bis = False
    
    # 如果以双斜杠起，则为行注释
    idx = line.find("//")
    if( idx >= 0 ):
        # 有行注释标记，取出该标记之前的全部内容，检查是否有空格之外的其它字符，有就不是注释
        is_have_char = isHaveChar(line,0,idx)
        if ( is_have_char ):
            # 双斜杠前面有字符，检查后面是否有换行符？有的话就把换行符到双斜杠之间的所有字符全部删除
            # idxn = line.find("\n")
            bis = False
        else:
            bis = True
    else:
        bis = False
    # print("isLineComment idx:"+repr(idx)+" bis:"+str(bis)+" line:"+line)
    return bis

def remove_comment_line(path):
    # 移除掉所有行注释
    newcts = ""
    f = open(path,encoding='UTF-8')
    line = f.readline()
    while line:
        # print(line)
        # 先移除掉该行所有空格，不行，一旦全部移除，正常的变量与声明之间的空格也没了，代码不成代码了
        # line = remove_str(line," ")
        # bisline = isLineComment(line)
        # if( not bisline ):
        #     newcts += line
        idxx = line.find("//")
        # idxn = line.find("\n")
        if( idxx >= 0 ):
            strl = line[:idxx] #line[idxx:(idxn-1)]
            # print("line:"+line)
            # print("idxx:"+repr(idxx)+" idxn:"+repr(idxn)+" strl:"+strl)
            newcts += strl
        else:
            newcts += line
        line = f.readline()

    f.close()

    return newcts

def remove_comment_block(contents):
    # 移除掉所有块注释
    newcts = contents

    return newcts

def remove_str(contents,key):
    newstr = contents
    newstr = newstr.replace(key,"")
    return newstr


def getFileInfo(fpath):

    # 从路径字符串中分出路径、文件名、扩展名
    arr = fpath.split("\\")
    
    path = ""
    fname = ""
    for i in range(len(arr)):
        if( i < (len(arr)-1) ):
            stri = arr[i]
            path += stri+"\\"
        elif ( i == (len(arr)-1) ):
            fname = arr[i]
    # print("path:"+path)
    # print("fname:"+fname)

    fext = ""
    arrname = fname.split(".")
    try:
        fname = arrname[0]
        fext = arrname[1]
    except IOError:
        print("解析文件名扩展名出错了")
    
    # print("fname:"+fname)
    # print("fext:"+fext)

    return path,fname,fext

def open_and_modify(fpath):
    # f = open(fpath,encoding='UTF-8')
    # lines = f.read()
    # f.close()

    # 取出路径和文件名
    path,fname,fext = getFileInfo(fpath)
    # print(lines)
    # 去掉所有行注释
    lines = remove_comment_line(fpath)
    # 去掉所有块注释
    # lines = remove_comment_block(lines)
    # 去掉所有空格
    # lines = remove_str(lines," ")
    # 去掉所有换行
    lines = remove_str(lines,"\n")

    # 根据文件名，生成新的文件的名字
    newfname = fname + ".min."+fext
    filew = open(path+newfname,"w")
    filew.write(lines)
    filew.close()

    return


open_and_modify(filepath)