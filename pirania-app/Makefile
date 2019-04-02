include $(TOPDIR)/rules.mk

PKG_NAME:=ubus-pirania
PKG_VERSION=$(GIT_COMMIT_DATE)-$(GIT_COMMIT_TSTAMP)
GIT_COMMIT_DATE:=$(shell git log -n 1 --pretty=%ad --date=short . )
GIT_COMMIT_TSTAMP:=$(shell git log -n 1 --pretty=%at . )

include $(INCLUDE_DIR)/package.mk

define Package/$(PKG_NAME)
  SECTION:=ubus
  CATEGORY:=Ubus
  SUBMENU:=3. Applications
  MAINTAINER:=Marcos Gutierrez <gmarcos87@gmail.com> Luandro <luandro@gmail.com>
  TITLE:=BMX6 ubus status module
  DEPENDS:= +lua +libubus-lua +luci-lib-nixio +luci-lib-json
  PKGARCH:=all
endef

define Build/Compile
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/
	$(CP) ./files/* $(1)/
	@chmod a+x $(1)/usr/libexec/rpcd/ubus-pirania.lua
	@chmod a+x $(1)/www/cgi-bin/client_ip
	/etc/init.d/rpcd restart && /etc/init.d/uhttpd restart
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
