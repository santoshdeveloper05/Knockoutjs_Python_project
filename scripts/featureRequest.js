
// The featureRequestViewModel holds the properties related to Feature Request Form.

var featureRequestViewModel = function () {
    var self = this;

    var url = window.location.href.split('/');
    var relativeUrl = url[0] + '//' + url[2] + '/';

    self.baseUrl = "http://54.210.117.115";
    self.createPageUrl = relativeUrl + "featureRequest.html";
    self.indexPageUrl = relativeUrl + "index.html";
    self.showLoader = ko.observable(false);
    self.priorites1 = [];
    self.clients1 = [];
    self.productAreas1 = [];

    self.featureModel = {
        id: ko.observable(),
        title: ko.observable(''),
        description: ko.observable(),
        client: ko.observable(),
        clientPriority: ko.observable(),
        clients: ko.observableArray([]),//['ClientA', 'ClientB', 'ClientC']
        targetDate: ko.observable(),
        productArea: ko.observable(),
        productAreas: ko.observableArray([]), //['Policies', "Billing", "Claims", "Reports"]
        priorities: ko.observableArray([]),
        clientLink: ko.observable(),
        clientPriorityLink: ko.observable(),
        productAreaLink: ko.observable(),
        relationships: {
            client: {
                type: ko.observable("client"),
                id: ko.observable()
            },
            client_priority: {
                type: ko.observable("priority"),
                id: ko.observable()
            },
            product_area: {
                type: ko.observable("product_area"),
                id: ko.observable()
            }

        }
    }

    //Holds data to show in feature table.
    self.features = ko.observableArray([]);

    //For Page Size
    self.pageSize = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    self.selectedPageSize = ko.observable();

    //Search
    self.searchField = ko.observable();


    self.getPriorities = function () {
        let url = ""
        let priorites = [];
        $.getJSON(self.baseUrl + "/priorities", function (data) {
            if (data !== undefined && data.data.length > 0) {
                for (let i = 0; i < data.data.length; i++) {
                    let priority = {
                        priority: data.data[i].attributes.priority,
                        id: data.data[i].id
                    }
                    priorites.push(priority);
                    self.priorites1.push(priority);
                }

                ko.mapping.fromJS(priorites, {}, self.featureModel.priorities);
            }
        });
    }

    self.getClients = function () {
        let url = ""
        let clients = [];
        $.getJSON(self.baseUrl + "/clients", function (data) {
            if (data !== undefined && data.data.length > 0) {
                for (let i = 0; i < data.data.length; i++) {
                    let client = {
                        name: data.data[i].attributes.name,
                        id: data.data[i].id
                    }
                    clients.push(client);
                    self.clients1.push(client);
                }

                ko.mapping.fromJS(clients, {}, self.featureModel.clients);
            }
        });
    }

    self.getProductAreas = function () {
        let url = ""
        let productAreas = [];
        $.getJSON(self.baseUrl + "/product_areas", function (data) {
            if (data !== undefined && data.data.length > 0) {
                for (let i = 0; i < data.data.length; i++) {
                    let productArea = {
                        product_Area: data.data[i].attributes.name,
                        id: data.data[i].id
                    }
                    productAreas.push(productArea);
                    self.productAreas1.push(productArea);
                }

                ko.mapping.fromJS(productAreas, {}, self.featureModel.productAreas);
            }
        });
    }

    self.addFeature = function () {

        self.showLoader(true);

        let clientId = self.featureModel.client().id();
        let priorityId = self.featureModel.clientPriority().id();
        let productAreaId = self.featureModel.productArea().id();
        let featureObj = {
            data: {
                type: "feature_request",
                attributes: {
                    id: self.featureModel.id(),
                    title: self.featureModel.title(),
                    description: self.featureModel.description(),
                    target_date: self.featureModel.targetDate()
                },
                relationships: {
                    client: {
                        data: {
                            type: "client",
                            id: clientId
                        }
                    },
                    client_priority: {
                        data: {
                            type: "priority",
                            id: priorityId
                        }
                    },
                    product_area: {
                        data: {
                            type: "product_area",
                            id: productAreaId
                        }
                    }
                }
            }
        }

        let id = self.featureModel.id();

        let postUpdateUrl = id === undefined ? self.baseUrl + "/feature_requests" : self.baseUrl + "/feature_requests/" + id

        $.ajax({            type: id === undefined ? 'POST' : 'PATCH',            async: false,            url: postUpdateUrl,            contentType: "application/json; charset=utf-8",            dataType: "json",            crossDomain: true,            data: JSON.stringify(featureObj),            success: function (data) {                console.log(data)                window.location.href = self.indexPageUrl;            },            error: function (data) {                console.log(data)            }
        });

        self.showLoader(false);

        //if (self.featureModel.id() !== undefined && self.featureModel.id() != 0) {
        //    console.log(queryData);
        //    self.showLoader(false);
        //    $.post(self.baseUrl + "/feature_requests/" + self.featureModel.id(), queryData, function (returnedData) {
        //        window.location.href = self.indexPageUrl;
        //    })
        //}
        //else {
        //    console.log(queryData);
        //    self.showLoader(false);
        //    $.post(self.baseUrl + "/feature_requests", queryData, function (returnedData) {
        //        window.location.href = self.indexPageUrl;
        //    })
        //}
    }



    self.getFeatures = function () {

        self.showLoader(true);
        let url = self.baseUrl + "/feature_requests";
        let productAreaUrl = self.baseUrl;
        let clientUrl = self.baseUrl;
        let clientPriorityUrl = self.baseUrl;

        let tempFeatureRequests = [];
        let isGetSuccess = false;
        $.getJSON(url, function (data) {
            let tempData = data.data;

            if (tempData !== undefined && tempData.length > 0) {
                isGetSuccess = true;
                for (let i = 0; i < tempData.length; i++) {
                    let tempFeatureRequest = {
                        title: tempData[i].attributes.title,
                        id: tempData[i].id,
                        description: tempData[i].attributes.description,
                        targetDate: tempData[i].attributes.target_date,

                        client: tempData[i].relationships.client.links.self,
                        clientPriority: tempData[i].relationships.client_priority.links.self,
                        productArea: tempData[i].relationships.product_area.links.self
                    }
                    tempFeatureRequests.push(tempFeatureRequest);
                }
            }
            self.showLoader(false);
            if (isGetSuccess)
                tempFeatureRequests.forEach(function (item, i, sourceArray) {

                    try {



                        let client = "";
                        let productArea = "";
                        let priority = "";

                        let clientlink = item.client;
                        let clientLinkSplit = clientlink.split('/');
                        let clientId = clientLinkSplit[clientLinkSplit.length - 1];
                        let displayClient = self.clients1.filter(c => c.id === clientId)
                        if (displayClient !== null)
                            tempFeatureRequests[i].client = displayClient[0].name;

                        let priorityLink = item.clientPriority;
                        let priorityLinkSplit = priorityLink.split('/');
                        let priorityId = priorityLinkSplit[priorityLinkSplit.length - 1];
                        let displayPriority = self.priorites1.filter(c => c.id === priorityId)
                        if (displayPriority !== null)
                            tempFeatureRequests[i].clientPriority = displayPriority[0].priority;

                        let productAreaLink = item.productArea;
                        let productAreaSplit = productAreaLink.split('/');
                        let productAreaId = productAreaSplit[productAreaSplit.length - 1];
                        let displayProductArea = self.productAreas1.filter(c => c.id == productAreaId)
                        if (displayProductArea !== null)
                            tempFeatureRequests[i].productArea = displayProductArea[0].product_Area;
                    } catch (e) {

                    }
                    var observableData = ko.mapping.fromJS(tempFeatureRequests);
                    ko.mapping.fromJS(tempFeatureRequests, {}, self.features);
                })

        })




        //let featureRequests = featureAreaData.slice(0, self.selectedPageSize());

        //if (self.searchField() !== undefined)
        //    featureRequests = featureRequests.filter(function (el) {
        //        return (el.client.indexOf(self.searchField()) > -1 || el.title.indexOf(self.searchField()) > -1
        //            || el.description.indexOf(self.searchField()) > -1
        //            || el.productArea.indexOf(self.searchField()) > -1 || el.targetDate.indexOf(self.searchField()) > -1)
        //    });

        //ko.mapping.fromJS(featureRequests, {}, self.features);
        //console.log(self.features);

    }

    self.getFeatureById = function (id) {
        self.showLoader(true);
        let featureRequestByIdUrl = "http://54.210.117.115/feature_requests/1";
        $.getJSON(featureRequestByIdUrl, function (data) {
            if (data !== undefined && data.data !== undefined) {

                try {

                    let clientlink = data.data.relationships.client.links.self;
                    let clientLinkSplit = clientlink.split('/');
                    let clientId = clientLinkSplit[clientLinkSplit.length - 1];
                    let displayClient = self.clients1.filter(c => c.id === clientId)
                    if (displayClient !== null)
                        displayClient = displayClient[0].name;

                    let priorityLink = data.data.relationships.client_priority.links.self;
                    let priorityLinkSplit = priorityLink.split('/');
                    let priorityId = priorityLinkSplit[priorityLinkSplit.length - 1];
                    let displayPriority = self.priorites1.filter(c => c.id === priorityId)
                    if (displayPriority !== null)
                        displayPriority = displayPriority[0].priority;

                    let productAreaLink = data.data.relationships.product_area.links.self;
                    let productAreaSplit = productAreaLink.split('/');
                    let productAreaId = productAreaSplit[productAreaSplit.length - 1];
                    let displayProductArea = self.productAreas1.filter(c => c.id == productAreaId)
                    if (displayProductArea !== null)
                        displayProductArea = displayProductArea[0].product_Area;

                    let tempFeatureRequest = {
                        title: data.data.attributes.title,
                        id: data.data.id,
                        description: data.data.attributes.description,
                        targetDate: data.data.attributes.target_date,
                        client: displayClient,
                        clientPriority: displayPriority,
                        productArea: 1
                    }
                } catch (e) {

                }
                let observableData = ko.mapping.fromJS(tempFeatureRequest, self.featureModel);
                self.featureModel.title(observableData.title());
                self.featureModel.id(observableData.id());
                self.featureModel.description(observableData.description());
                self.featureModel.client(observableData.client());
                self.featureModel.clientPriority(observableData.clientPriority());
                self.featureModel.targetDate(observableData.targetDate());
                self.featureModel.productArea(observableData.productArea());
            }
        });

        self.showLoader(false);
    }

    self.getTargetDate = function (targetDate1) {
        let targetDate = targetDate1.split('/');
        let date = new Date(targetDate[2], targetDate[1] - 1, targetDate[0]);

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString();
        var dd = date.getDate().toString();

        // CONVERT mm AND dd INTO chars
        var mmChars = mm.split('');
        var ddChars = dd.split('');

        // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
        var datestring = yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
        return datestring;
    }

    self.navigateToCreateRequest = function () {
        window.location.href = self.createPageUrl;
    }

    self.cancel = function () {
        window.location.href = self.indexPageUrl;
    }

    self.navigateToEdit = function (item) {
        window.location.href = self.createPageUrl + "?id=" + item.id();
    }

    self.pageSizeChange = function () {
        self.getFeatures();
    }

    self.searchFeatures = function (d, e) {
        if (e.keyCode === 13) {
            self.getFeatures();
            //  let url = "/iws/features/requests/search?pageSize= " + self.selectedPageSize()+" &page=&query=&sortOn=&sort=";

            //$.getJSON("https://reqres.in/api/users?id:" + id, function (data) {
            //    var observableData = ko.mapping.fromJS(data);
            //    // let model  = observableData();

            //})

        }
    }

    self.getQueryStrings = function () {
        var assoc = {};
        var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
        var queryString = location.search.substring(1);
        var keyValues = queryString.split('&');

        for (var i in keyValues) {
            var key = keyValues[i].split('=');
            if (key.length > 1) {
                assoc[decode(key[0])] = decode(key[1]);
            }
        }
        return assoc;
    }

};

var featureAreaData = [{
    "id": 1,
    "title": "Cruickshank, Fisher and Jast",
    "description": "Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
    "client": "Thoughtstorm",
    "clientPriority": 1,
    "targetDate": "4/28/2017",
    "productArea": "Pork - Hock And Feet Attached"
}, {
    "id": 2,
    "title": "Brakus, Gaylord and Volkman",
    "description": "Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
    "client": "Mybuzz",
    "clientPriority": 2,
    "targetDate": "9/22/2017",
    "productArea": "Muffin - Blueberry Individual"
}, {
    "id": 3,
    "title": "Beier-Pacocha",
    "description": "In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.",
    "client": "Browsezoom",
    "clientPriority": 3,
    "targetDate": "3/18/2017",
    "productArea": "Muffin Mix - Blueberry"
}, {
    "id": 4,
    "title": "Yundt-Rosenbaum",
    "description": "Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",
    "client": "Jetpulse",
    "clientPriority": 4,
    "targetDate": "4/5/2017",
    "productArea": "Beef - Ground Medium"
}, {
    "id": 5,
    "title": "MacGyver, Dach and Bednar",
    "description": "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl.",
    "client": "Skyble",
    "clientPriority": 5,
    "targetDate": "6/5/2017",
    "productArea": "Doilies - 8, Paper"
}, {
    "id": 6,
    "title": "Schmitt Group",
    "description": "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum.",
    "client": "Meembee",
    "clientPriority": 6,
    "targetDate": "3/4/2017",
    "productArea": "Ecolab - Balanced Fusion"
}, {
    "id": 7,
    "title": "Parker-Strosin",
    "description": "Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.",
    "client": "Skinte",
    "clientPriority": 7,
    "targetDate": "7/6/2017",
    "productArea": "Flower - Dish Garden"
}, {
    "id": 8,
    "title": "Hartmann and Sons",
    "description": "Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl.",
    "client": "Tanoodle",
    "clientPriority": 8,
    "targetDate": "3/2/2017",
    "productArea": "Juice - Apple 284ml"
}, {
    "id": 9,
    "title": "Nader, Skiles and Grant",
    "description": "Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.",
    "client": "Buzzster",
    "clientPriority": 9,
    "targetDate": "8/19/2017",
    "productArea": "Bay Leaf Ground"
}, {
    "id": 10,
    "title": "Howell-Crist",
    "description": "Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis.",
    "client": "Fiveclub",
    "clientPriority": 10,
    "targetDate": "11/21/2017",
    "productArea": "Yoghurt Tubes"
}, {
    "id": 11,
    "title": "Price-Dibbert",
    "description": "Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla.",
    "client": "Yombu",
    "clientPriority": 11,
    "targetDate": "3/30/2017",
    "productArea": "Pastry - Lemon Danish - Mini"
}, {
    "id": 12,
    "title": "Kshlerin-Deckow",
    "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.",
    "client": "Kwinu",
    "clientPriority": 12,
    "targetDate": "9/14/2017",
    "productArea": "Pectin"
}, {
    "id": 13,
    "title": "Abbott-Dooley",
    "description": "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla.",
    "client": "Twinte",
    "clientPriority": 13,
    "targetDate": "3/6/2017",
    "productArea": "Sugar Thermometer"
}, {
    "id": 14,
    "title": "Bartoletti-Sanford",
    "description": "Aliquam erat volutpat. In congue. Etiam justo.",
    "client": "Eadel",
    "clientPriority": 14,
    "targetDate": "3/26/2017",
    "productArea": "Jam - Apricot"
}, {
    "id": 15,
    "title": "Bosco-Harvey",
    "description": "Duis consequat dui nec nisi volutpat eleifend.",
    "client": "Skyble",
    "clientPriority": 15,
    "targetDate": "11/26/2017",
    "productArea": "Salmon - Canned"
}, {
    "id": 16,
    "title": "Aufderhar, DuBuque and Franecki",
    "description": "Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices.",
    "client": "Flashset",
    "clientPriority": 16,
    "targetDate": "4/22/2017",
    "productArea": "Roe - White Fish"
}, {
    "id": 17,
    "title": "Rogahn and Sons",
    "description": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris. Morbi non lectus.",
    "client": "Dabvine",
    "clientPriority": 17,
    "targetDate": "7/26/2017",
    "productArea": "Tart Shells - Sweet, 2"
}, {
    "id": 18,
    "title": "Green LLC",
    "description": "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo.",
    "client": "Twinder",
    "clientPriority": 18,
    "targetDate": "12/2/2017",
    "productArea": "Wine - Ice Wine"
}, {
    "id": 19,
    "title": "Ferry-Hermiston",
    "description": "Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam.",
    "client": "Talane",
    "clientPriority": 19,
    "targetDate": "10/26/2017",
    "productArea": "Chicken - Leg, Boneless"
}, {
    "id": 20,
    "title": "Wehner Inc",
    "description": "Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis.",
    "client": "Skiptube",
    "clientPriority": 20,
    "targetDate": "10/15/2017",
    "productArea": "Ice Cream Bar - Hagen Daz"
}, {
    "id": 21,
    "title": "Kuhlman Group",
    "description": "Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.",
    "client": "Meezzy",
    "clientPriority": 21,
    "targetDate": "8/19/2017",
    "productArea": "Garlic Powder"
}, {
    "id": 22,
    "title": "Gutmann, Barton and Stoltenberg",
    "description": "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo.",
    "client": "Dabtype",
    "clientPriority": 22,
    "targetDate": "8/3/2017",
    "productArea": "Dates"
}, {
    "id": 23,
    "title": "Legros Inc",
    "description": "Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio.",
    "client": "Rhybox",
    "clientPriority": 23,
    "targetDate": "6/28/2017",
    "productArea": "Tomatillo"
}, {
    "id": 24,
    "title": "Sanford LLC",
    "description": "Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.",
    "client": "Meetz",
    "clientPriority": 24,
    "targetDate": "6/26/2017",
    "productArea": "Oil - Olive"
}, {
    "id": 25,
    "title": "Heaney-Reinger",
    "description": "Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.",
    "client": "Mycat",
    "clientPriority": 25,
    "targetDate": "11/24/2017",
    "productArea": "Pork - Ham Hocks - Smoked"
}, {
    "id": 26,
    "title": "Cassin LLC",
    "description": "Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla.",
    "client": "Quamba",
    "clientPriority": 26,
    "targetDate": "1/14/2017",
    "productArea": "Gatorade - Xfactor Berry"
}, {
    "id": 27,
    "title": "Lowe-Funk",
    "description": "Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
    "client": "Bubblemix",
    "clientPriority": 27,
    "targetDate": "9/24/2017",
    "productArea": "Mushroom - Lg - Cello"
}, {
    "id": 28,
    "title": "Maggio, Dickinson and Mann",
    "description": "Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio.",
    "client": "Oozz",
    "clientPriority": 28,
    "targetDate": "2/19/2017",
    "productArea": "Anchovy Paste - 56 G Tube"
}, {
    "id": 29,
    "title": "Price-Reynolds",
    "description": "Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
    "client": "Avaveo",
    "clientPriority": 29,
    "targetDate": "1/4/2017",
    "productArea": "Curry Paste - Green Masala"
}, {
    "id": 30,
    "title": "Morar Group",
    "description": "In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
    "client": "Mynte",
    "clientPriority": 30,
    "targetDate": "4/13/2017",
    "productArea": "Lettuce - Boston Bib - Organic"
}, {
    "id": 31,
    "title": "Hermiston-Watsica",
    "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.",
    "client": "Thoughtstorm",
    "clientPriority": 31,
    "targetDate": "10/17/2017",
    "productArea": "Wine La Vielle Ferme Cote Du"
}, {
    "id": 32,
    "title": "Feil Group",
    "description": "Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque.",
    "client": "Snaptags",
    "clientPriority": 32,
    "targetDate": "10/31/2017",
    "productArea": "Bag - Clear 7 Lb"
}, {
    "id": 33,
    "title": "Kutch LLC",
    "description": "Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo.",
    "client": "Oloo",
    "clientPriority": 33,
    "targetDate": "5/16/2017",
    "productArea": "Wine - White, Concha Y Toro"
}, {
    "id": 34,
    "title": "Ferry-Dach",
    "description": "Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.",
    "client": "Blogpad",
    "clientPriority": 34,
    "targetDate": "9/10/2017",
    "productArea": "Lobster - Cooked"
}, {
    "id": 35,
    "title": "Heaney, Howell and Haley",
    "description": "Proin eu mi.",
    "client": "Jabberbean",
    "clientPriority": 35,
    "targetDate": "4/5/2017",
    "productArea": "Extract Vanilla Pure"
}, {
    "id": 36,
    "title": "Franecki-Simonis",
    "description": "Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh.",
    "client": "Ozu",
    "clientPriority": 36,
    "targetDate": "12/19/2016",
    "productArea": "Lettuce - Escarole"
}, {
    "id": 37,
    "title": "Cole-West",
    "description": "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl.",
    "client": "Oyoloo",
    "clientPriority": 37,
    "targetDate": "8/9/2017",
    "productArea": "Lettuce - Frisee"
}, {
    "id": 38,
    "title": "Dare Inc",
    "description": "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti.",
    "client": "Thoughtmix",
    "clientPriority": 38,
    "targetDate": "3/24/2017",
    "productArea": "Wine - Red, Metus Rose"
}, {
    "id": 39,
    "title": "Kirlin, O'Reilly and Mraz",
    "description": "Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.",
    "client": "Kazu",
    "clientPriority": 39,
    "targetDate": "8/13/2017",
    "productArea": "Melon - Cantaloupe"
}, {
    "id": 40,
    "title": "Dach Inc",
    "description": "Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
    "client": "Blogspan",
    "clientPriority": 40,
    "targetDate": "10/18/2017",
    "productArea": "Celery"
}, {
    "id": 41,
    "title": "Bergstrom Inc",
    "description": "Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est.",
    "client": "Yamia",
    "clientPriority": 41,
    "targetDate": "12/18/2016",
    "productArea": "Fudge - Cream Fudge"
}, {
    "id": 42,
    "title": "Altenwerth, Moen and Will",
    "description": "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc.",
    "client": "Jetpulse",
    "clientPriority": 42,
    "targetDate": "8/8/2017",
    "productArea": "Buffalo - Short Rib Fresh"
}, {
    "id": 43,
    "title": "Predovic, Barton and Hermiston",
    "description": "Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis.",
    "client": "Chatterbridge",
    "clientPriority": 43,
    "targetDate": "4/4/2017",
    "productArea": "Iced Tea - Lemon, 340ml"
}, {
    "id": 44,
    "title": "Schaden, Hermiston and Willms",
    "description": "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.",
    "client": "Skyndu",
    "clientPriority": 44,
    "targetDate": "6/26/2017",
    "productArea": "Papadam"
}, {
    "id": 45,
    "title": "Turner LLC",
    "description": "Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh.",
    "client": "Tagpad",
    "clientPriority": 45,
    "targetDate": "2/3/2017",
    "productArea": "Wine - Magnotta, White"
}, {
    "id": 46,
    "title": "Parker-Mann",
    "description": "Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla.",
    "client": "Skiba",
    "clientPriority": 46,
    "targetDate": "5/25/2017",
    "productArea": "Tarts Assorted"
}, {
    "id": 47,
    "title": "Fisher, Moore and Moen",
    "description": "Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis.",
    "client": "Yombu",
    "clientPriority": 47,
    "targetDate": "7/13/2017",
    "productArea": "Basil - Dry, Rubbed"
}, {
    "id": 48,
    "title": "Rutherford-Schuster",
    "description": "Vestibulum ac est lacinia nisi venenatis tristique.",
    "client": "Browsebug",
    "clientPriority": 48,
    "targetDate": "2/24/2017",
    "productArea": "Bar Mix - Pina Colada, 355 Ml"
}, {
    "id": 49,
    "title": "Hodkiewicz, Marquardt and Jaskolski",
    "description": "Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo.",
    "client": "Shuffledrive",
    "clientPriority": 49,
    "targetDate": "1/28/2017",
    "productArea": "Oneshot Automatic Soap System"
}, {
    "id": 50,
    "title": "Feest-Torphy",
    "description": "Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
    "client": "Dynazzy",
    "clientPriority": 50,
    "targetDate": "12/29/2016",
    "productArea": "Temperature Recording Station"
}, {
    "id": 51,
    "title": "Morissette, Lesch and Greenholt",
    "description": "Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique.",
    "client": "Trilith",
    "clientPriority": 51,
    "targetDate": "4/24/2017",
    "productArea": "Bag Clear 10 Lb"
}, {
    "id": 52,
    "title": "Homenick Inc",
    "description": "In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.",
    "client": "Meevee",
    "clientPriority": 52,
    "targetDate": "1/24/2017",
    "productArea": "Bok Choy - Baby"
}, {
    "id": 53,
    "title": "Schimmel, Thiel and Denesik",
    "description": "Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa.",
    "client": "Zoomzone",
    "clientPriority": 53,
    "targetDate": "6/17/2017",
    "productArea": "Juice - Ocean Spray Cranberry"
}, {
    "id": 54,
    "title": "Rohan, Volkman and Bechtelar",
    "description": "Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.",
    "client": "Oozz",
    "clientPriority": 54,
    "targetDate": "9/25/2017",
    "productArea": "Shiro Miso"
}, {
    "id": 55,
    "title": "Bradtke, Altenwerth and Will",
    "description": "Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
    "client": "Edgewire",
    "clientPriority": 55,
    "targetDate": "2/18/2017",
    "productArea": "Passion Fruit"
}, {
    "id": 56,
    "title": "Lind, Ernser and Runolfsson",
    "description": "Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis.",
    "client": "Centimia",
    "clientPriority": 56,
    "targetDate": "12/6/2017",
    "productArea": "Black Currants"
}, {
    "id": 57,
    "title": "Hansen and Sons",
    "description": "Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy.",
    "client": "Mycat",
    "clientPriority": 57,
    "targetDate": "2/7/2017",
    "productArea": "Red Currants"
}, {
    "id": 58,
    "title": "Corwin and Sons",
    "description": "Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
    "client": "Chatterbridge",
    "clientPriority": 58,
    "targetDate": "1/7/2017",
    "productArea": "Onions Granulated"
}, {
    "id": 59,
    "title": "Christiansen-Koepp",
    "description": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",
    "client": "Topiclounge",
    "clientPriority": 59,
    "targetDate": "5/24/2017",
    "productArea": "Salmon Atl.whole 8 - 10 Lb"
}, {
    "id": 60,
    "title": "Boyle-Lang",
    "description": "Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst.",
    "client": "Fiveclub",
    "clientPriority": 60,
    "targetDate": "8/25/2017",
    "productArea": "Juice - Apple Cider"
}, {
    "id": 61,
    "title": "Moen, Muller and Treutel",
    "description": "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.",
    "client": "Avaveo",
    "clientPriority": 61,
    "targetDate": "2/26/2017",
    "productArea": "Soup - Beef, Base Mix"
}, {
    "id": 62,
    "title": "Haley-Crona",
    "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc.",
    "client": "Avamba",
    "clientPriority": 62,
    "targetDate": "3/20/2017",
    "productArea": "Beef - Cooked, Corned"
}, {
    "id": 63,
    "title": "Yost Group",
    "description": "Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.",
    "client": "Oyonder",
    "clientPriority": 63,
    "targetDate": "1/11/2017",
    "productArea": "English Muffin"
}, {
    "id": 64,
    "title": "Wolf and Sons",
    "description": "Etiam vel augue.",
    "client": "Jaloo",
    "clientPriority": 64,
    "targetDate": "7/10/2017",
    "productArea": "Wine - Red, Black Opal Shiraz"
}, {
    "id": 65,
    "title": "Streich-Jakubowski",
    "description": "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo.",
    "client": "Vinder",
    "clientPriority": 65,
    "targetDate": "5/14/2017",
    "productArea": "Swordfish Loin Portions"
}, {
    "id": 66,
    "title": "Ratke-Lang",
    "description": "Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy.",
    "client": "Oyondu",
    "clientPriority": 66,
    "targetDate": "3/5/2017",
    "productArea": "Dooleys Toffee"
}, {
    "id": 67,
    "title": "Bradtke Inc",
    "description": "Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus.",
    "client": "Jabbersphere",
    "clientPriority": 67,
    "targetDate": "3/24/2017",
    "productArea": "Molasses - Fancy"
}, {
    "id": 68,
    "title": "Casper-King",
    "description": "Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien.",
    "client": "Brightdog",
    "clientPriority": 68,
    "targetDate": "3/26/2017",
    "productArea": "Wine - Touraine Azay - Le - Rideau"
}, {
    "id": 69,
    "title": "Yundt Inc",
    "description": "Ut at dolor quis odio consequat varius. Integer ac leo.",
    "client": "Fiveclub",
    "clientPriority": 69,
    "targetDate": "12/14/2016",
    "productArea": "Sauce - Chili"
}, {
    "id": 70,
    "title": "Collier, Bartoletti and Sawayn",
    "description": "Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
    "client": "Gigaclub",
    "clientPriority": 70,
    "targetDate": "5/30/2017",
    "productArea": "Napkin Colour"
}, {
    "id": 71,
    "title": "Mante-Bartell",
    "description": "Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum.",
    "client": "Rooxo",
    "clientPriority": 71,
    "targetDate": "8/8/2017",
    "productArea": "Sardines"
}, {
    "id": 72,
    "title": "Block-Grant",
    "description": "Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero.",
    "client": "Pixope",
    "clientPriority": 72,
    "targetDate": "1/3/2017",
    "productArea": "Whmis - Spray Bottle Trigger"
}, {
    "id": 73,
    "title": "Walker LLC",
    "description": "Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla.",
    "client": "Twimm",
    "clientPriority": 73,
    "targetDate": "2/7/2017",
    "productArea": "Salmon Steak - Cohoe 6 Oz"
}, {
    "id": 74,
    "title": "Auer Inc",
    "description": "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.",
    "client": "Fivebridge",
    "clientPriority": 74,
    "targetDate": "7/4/2017",
    "productArea": "Artichoke - Fresh"
}, {
    "id": 75,
    "title": "Murray, Rolfson and Pfannerstill",
    "description": "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.",
    "client": "Pixope",
    "clientPriority": 75,
    "targetDate": "11/20/2017",
    "productArea": "Pepper - Red Chili"
}, {
    "id": 76,
    "title": "Kirlin, Huels and Morissette",
    "description": "Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue.",
    "client": "Topdrive",
    "clientPriority": 76,
    "targetDate": "4/12/2017",
    "productArea": "Cheese - Brie, Triple Creme"
}, {
    "id": 77,
    "title": "Swaniawski, Nolan and Stoltenberg",
    "description": "In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.",
    "client": "Livefish",
    "clientPriority": 77,
    "targetDate": "4/23/2017",
    "productArea": "Oysters - Smoked"
}, {
    "id": 78,
    "title": "Hettinger, Conroy and Funk",
    "description": "Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo.",
    "client": "Demivee",
    "clientPriority": 78,
    "targetDate": "4/23/2017",
    "productArea": "Juice - Grapefruit, 341 Ml"
}, {
    "id": 79,
    "title": "Marvin and Sons",
    "description": "Donec dapibus.",
    "client": "Zoomdog",
    "clientPriority": 79,
    "targetDate": "9/9/2017",
    "productArea": "Liqueur Banana, Ramazzotti"
}, {
    "id": 80,
    "title": "Macejkovic, Lueilwitz and Casper",
    "description": "Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien.",
    "client": "Feedmix",
    "clientPriority": 80,
    "targetDate": "8/16/2017",
    "productArea": "Artichoke - Hearts, Canned"
}, {
    "id": 81,
    "title": "Schaefer-Kertzmann",
    "description": "Aliquam non mauris. Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.",
    "client": "Voonte",
    "clientPriority": 81,
    "targetDate": "2/26/2017",
    "productArea": "Juice - Propel Sport"
}, {
    "id": 82,
    "title": "Pagac and Sons",
    "description": "Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum.",
    "client": "Plajo",
    "clientPriority": 82,
    "targetDate": "4/13/2017",
    "productArea": "Pasta - Angel Hair"
}, {
    "id": 83,
    "title": "Stamm Group",
    "description": "Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
    "client": "Babblestorm",
    "clientPriority": 83,
    "targetDate": "3/27/2017",
    "productArea": "Beer - Sleemans Cream Ale"
}, {
    "id": 84,
    "title": "Bednar and Sons",
    "description": "Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula.",
    "client": "Twitterbridge",
    "clientPriority": 84,
    "targetDate": "4/23/2017",
    "productArea": "Otomegusa Dashi Konbu"
}, {
    "id": 85,
    "title": "Reynolds and Sons",
    "description": "Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo.",
    "client": "Nlounge",
    "clientPriority": 85,
    "targetDate": "12/6/2017",
    "productArea": "Tomatoes - Grape"
}, {
    "id": 86,
    "title": "Orn-Breitenberg",
    "description": "Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.",
    "client": "Edgetag",
    "clientPriority": 86,
    "targetDate": "4/13/2017",
    "productArea": "Cabbage - Savoy"
}, {
    "id": 87,
    "title": "Legros LLC",
    "description": "Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.",
    "client": "Skidoo",
    "clientPriority": 87,
    "targetDate": "1/26/2017",
    "productArea": "Tart - Butter Plain Squares"
}, {
    "id": 88,
    "title": "Hudson, Adams and Fadel",
    "description": "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo.",
    "client": "Ainyx",
    "clientPriority": 88,
    "targetDate": "1/8/2017",
    "productArea": "Crab - Meat"
}, {
    "id": 89,
    "title": "Streich-Grant",
    "description": "Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa.",
    "client": "Twimm",
    "clientPriority": 89,
    "targetDate": "8/17/2017",
    "productArea": "Shrimp, Dried, Small / Lb"
}, {
    "id": 90,
    "title": "Runolfsdottir and Sons",
    "description": "Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.",
    "client": "Zoomdog",
    "clientPriority": 90,
    "targetDate": "12/18/2016",
    "productArea": "Calypso - Pineapple Passion"
}, {
    "id": 91,
    "title": "Sauer, Ratke and Pollich",
    "description": "Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.",
    "client": "Voolia",
    "clientPriority": 91,
    "targetDate": "11/13/2017",
    "productArea": "Brandy - Orange, Mc Guiness"
}, {
    "id": 92,
    "title": "Simonis, Considine and Hills",
    "description": "In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt.",
    "client": "Brightdog",
    "clientPriority": 92,
    "targetDate": "5/3/2017",
    "productArea": "Carbonated Water - Orange"
}, {
    "id": 93,
    "title": "Altenwerth, Bins and Stokes",
    "description": "Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est.",
    "client": "Babbleblab",
    "clientPriority": 93,
    "targetDate": "10/29/2017",
    "productArea": "Chips Potato Salt Vinegar 43g"
}, {
    "id": 94,
    "title": "Wilderman, Lehner and Bergstrom",
    "description": "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim.",
    "client": "Linktype",
    "clientPriority": 94,
    "targetDate": "6/16/2017",
    "productArea": "Tart Shells - Sweet, 4"
}, {
    "id": 95,
    "title": "Hilpert, Moore and Haley",
    "description": "Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum.",
    "client": "Shuffledrive",
    "clientPriority": 95,
    "targetDate": "2/22/2017",
    "productArea": "Truffle - Peelings"
}, {
    "id": 96,
    "title": "Kessler-Bernhard",
    "description": "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.",
    "client": "Eimbee",
    "clientPriority": 96,
    "targetDate": "3/23/2017",
    "productArea": "Lentils - Red, Dry"
}, {
    "id": 97,
    "title": "Purdy Inc",
    "description": "Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.",
    "client": "Kaymbo",
    "clientPriority": 97,
    "targetDate": "10/8/2017",
    "productArea": "Water - Evian 355 Ml"
}, {
    "id": 98,
    "title": "Jenkins-Schoen",
    "description": "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo.",
    "client": "Vinte",
    "clientPriority": 98,
    "targetDate": "3/5/2017",
    "productArea": "Asparagus - Frozen"
}, {
    "id": 99,
    "title": "Schmeler-Schiller",
    "description": "Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo.",
    "client": "Voonte",
    "clientPriority": 99,
    "targetDate": "5/12/2017",
    "productArea": "Bread - Calabrese Baguette"
}, {
    "id": 100,
    "title": "Muller, Keeling and Kunde",
    "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis.",
    "client": "Kwilith",
    "clientPriority": 100,
    "targetDate": "5/3/2017",
    "productArea": "Corn Meal"
}]
