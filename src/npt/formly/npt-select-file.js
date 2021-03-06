/**
 * Created by Shirley on 2016/1/5.
 */

angular.module("ui.neptune.formly.select-file", [])
    .config(function (formlyConfigProvider,uniqueArray) {
        formlyConfigProvider.setType({
            name: "npt-select-file",
            templateUrl: "/template/formly/npt-select-file.html",
            extends: "input",
            defaultOptions: {
                wrapper: ["showErrorMessage"],
                templateOptions: {
                    onSelect: function (model, options) {
                        var self = this;
                        self.selectFileApi.open().then(function (response) {
                            //如果是单选,则将第一行设置为数据, 如果是多选则提取所有数据的id
                            if (self.single && response && response.length > 0) {
                                model[options.key] = response[0].data[self.valueProp];
                            } else if (!self.single && response) {
                                if (model[options.key]) {
                                    if (!angular.isArray(model[options.key])) {
                                        model[options.key] = [model[options.key]];
                                    }
                                } else {
                                    model[options.key] = [];
                                }

                                angular.forEach(response, function (value) {
                                    model[options.key].push(value.data[self.valueProp]);
                                });
                                model[options.key] = uniqueArray(model[options.key]);
                            }

                        }, function () {

                        });
                    },
                    onRegisterApi: function (selectFileApi) {
                        this.selectFileApi = selectFileApi;
                    },
                    deleteItem: function (itemId,model, options) {
                        var target = model[options.key];
                        if (angular.isArray(target)) {
                            angular.forEach(target,function(id,$index) {
                                if (id == itemId) {
                                    target.splice($index,1);
                                }
                            });
                        } else {
                            model[options.key] = "";
                        }
                    },
                    imageRepository: undefined,
                    single: false,
                    valueProp: 'id'
                },
                controller: function ($scope) {
                    var vm = this;
                    var to = $scope.to;
                    var options = $scope.options;
                    to.selectedFiles = []; // 初始化时，置空已选图片
                    var uploadOptions = {
                        uploadImage: false,
                        uploadDoc: false,
                        uploadOther: true,
                        otherUpload: {
                            title: "上传文件",
                            filters: {
                                mime_types: [
                                    {title: "File", extensions: "doc,xls,docx,xlsx,pdf,txt,wps,md,ppt"}
                                ],
                                max_file_size: '10M'
                            },
                            multi_selection: true
                        },
                        onRegisterApi: function (api) {
                            api.onComplete(function (datas) {
                                //如果是单选,则将第一行设置为数据, 如果是多选则提取所有数据的id
                                if (to.single && datas && datas.length > 0) {
                                    $scope.model[options.key] = datas[0][to.valueProp];
                                } else if (!to.single && datas) {
                                    if ($scope.model[options.key]) {
                                        if (!angular.isArray($scope.model[options.key])) {
                                            $scope.model[options.key] = [$scope.model[options.key]];
                                        }
                                    } else {
                                        $scope.model[options.key] = [];
                                    }
                                    angular.forEach(datas, function (data) {
                                        $scope.model[options.key].push(data[to.valueProp]);
                                    });
                                }
                            });
                        }
                    };
                    if (to.uploadOptions) {
                        uploadOptions = angular.extend(uploadOptions, to.uploadOptions);
                    } else {
                        uploadOptions.uploadDoc = false;
                    }
                    to.uploadOptions = uploadOptions;

                },
                expressionProperties: {
                    "templateOptions.selectedFiles": function (viewValue, modelValue, field) {
                        if (modelValue) {
                            var selectedFiles = [];
                            modelValue = angular.isArray(modelValue) ? modelValue : [modelValue];
                            angular.forEach(modelValue, function (id) {
                                selectedFiles.push({
                                    file: {
                                        id: id
                                    }
                                });
                            });
                            return selectedFiles;
                        }
                    }
                }
            }
        });
    }).constant("uniqueArray",function unique(arr) {
        var result = [], hash = {};
        for (var i = 0, elem; i < arr.length; i++) {
            elem = arr[i];
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    });