#!gmake

# Makefile recreated by tom white 11/14/99
#
# This is a master template file for making acApps.
# just change the following three entries

# 1. list an object for each source file
objects = block.o sewnApp.o  
	
# 2. list the main stub for a standalone app
appobject = main.o

# 3. what is the target (name for application and application.so) called?
target = sewnApp

# you *shouldn't* have to edit anything below this line :-)
###############################################################################

# where are production lib and include directories?
ACLIB_DIR = /acg/lib
ACINC_DIR = /acg/include

################
# change this to either production or development
################
LIB_DIR = $(ACLIB_DIR)
INC_DIR = $(ACINC_DIR)

#what libs do I need for a statically linked executable
STATIC_LIBS = $(LIB_DIR)/libacWindow.a $(LIB_DIR)/libacu.a

#what is the library path when linking against production libraries
libs = -L/usr/X11R6/lib -L/usr/local/lib -L$(LIB_DIR) -L/usr/lib32 

#what libs are required for this application
libs = -lacWindow -lacu -lglut -lGLU -lGL -lsocket -lpthread -lXmu -lXext -lm -lX11 -lvl -ljpeg -lgutil -limage
applibs = -lglut -lGLU -lGL -lsocket -lpthread -lXmu -lXext -lm -lX11 -lvl -ljpeg -lgutil -limage

#tell gmake how to compile a cpp program
%.o : %.cpp
	CC -LANG:ansi-for-init-scope=ON -woff 1682 -woff 1174 -g -DACU_IRIX -I$(INC_DIR) -c $<

#default action is shared object and app
default : object app

#default target is a shared object using the local dev libs
object: $(objects)
	rm -f $(target).so
	/usr/bin/ld -n32 -shared $(objects) -o $(target).so
	chmod 555 $(target).so

#make a standalone using the global libraries
app: $(objects) $(appobject) 
	rm -f $(target)
	CC $(objects) $(appobject) $(STATIC_LIBS) -w -o $(target) $(libglobal) $(applibs) -g
	chmod 555 $(target)

install: object app
	rm -f /acg/data/objects/$(target).so
	cp $(target).so /acg/data/objects/.
	chmod 555 /acg/data/objects/$(target).so
	rm -f /acg/bin/$(target)
	cp $(target) /acg/bin/.
	chmod 555 /acg/bin/$(target)
	mkdir -m g+rw -p /mas/acg/projects/acApps/$(target)
	cp -r *.cpp *.h Makefile /mas/acg/projects/acApps/$(target)/.
	pwd > /mas/acg/projects/acApps/$(target)/installed-from


run:
	acwin $(target)

clean:
	rm -f $(target) *.o $(target).so so_locations

again: clean default
