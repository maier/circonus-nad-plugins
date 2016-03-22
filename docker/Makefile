DEST        := /opt/circonus/etc/node-agent.d/docker
BABEL	 	:= ./node_modules/.bin/babel
PAC 	 	:= ./node_modules/.bin/pac
PKGFILE 	:= circonus-docker.tar.gz

build: stats.js lib/stats/index.js events.js lib/events/index.js package.json Makefile
	install -d build
	$(BABEL) stats.js --out-file build/stats.js
	$(BABEL) events.js --out-file build/events.js
	$(BABEL) lib -d build/lib
	$(BABEL) test -d build/test
	$(PAC) --production
	cp -r .modules build/.
	install package.json build/.
	install Makefile build/.
	install README.md build/.
	install LICENSE build/.

.PHONY: check
check:
	@echo && echo "Checking source"
	eslint stats.js stats/index.js events.js events/index.js
	@ncu --prod

.PHONY: clean
clean:
	-rm -rf .modules
	-rm -rf build

package: $(PKGFILE)

$(PKGFILE): clean build
	COPYFILE_DISABLE=true tar -v -C build -czf $@ stats.js events.js lib .modules package.json README.md LICENSE

##
### the following are for use in the vagrant box during development
###
### e.g. ''' cd /vagrant/docker && make install '''
##

.PHONY: install
install:
	install -d -o root -g root -m 0755 $(DEST)
	install -d -o root -g root -m 0755 $(DEST)/lib
	install -d -o root -g root -m 0755 $(DEST)/lib/stats
	install -d -o root -g root -m 0755 $(DEST)/lib/events
	install -d -o root -g root -m 0755 $(DEST)/node_modules
	for f in build/.modules/*.tgz; do tar -zxf "$$f" -C "$(DEST)/node_modules"; done
	install -o root -g root -m 0644 build/README.md $(DEST)
	install -o root -g root -m 0644 build/LICENSE $(DEST)
	install -o root -g root -m 0644 build/package.json $(DEST)
	install -o root -g root -m 0644 build/stats.js $(DEST)
	install -o root -g root -m 0644 build/events.js $(DEST)
	install -o root -g root -m 0644 build/lib/stats/index.js $(DEST)/lib/stats
	install -o root -g root -m 0644 build/lib/events/index.js $(DEST)/lib/events
