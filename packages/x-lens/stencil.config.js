exports.config = {
    namespace: 'xlens',
    outputTargets: [
        {
            type: 'dist'
        },
        {
            type: 'www',
            serviceWorker: false
        }
    ]
};

exports.devServer = {
    root: 'www',
    watchGlob: '**/**'
};
