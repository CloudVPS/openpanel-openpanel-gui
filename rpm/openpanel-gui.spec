Name: 		openpanel-gui
Version: 	1.0.4
Release: 	1%{?dist}
Summary:  	OpenPanel GUI
License: 	GPLv3
Group: 		Applications/Internet
Source: 	%{name}-%{version}.tar.bz2
Requires:	openpanel-core
BuildRequires:	openpanel-core-devel
BuildRoot:	%{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)

%description
The OpenPanel GUI

%prep
%setup -q -n %{name}

%build
make

%install
rm -rf %{buildroot}
%makeinstall DESTDIR=%{buildroot}

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(-,openpanel-core,openpanel-core)
%{_localstatedir}/openpanel/*

%changelog
* Wed Jan 18 2011 Igmar Palsenberg <igmar@palsenberg.com>
- Initial packaging
