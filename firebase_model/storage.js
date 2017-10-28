const storage = {};
(function() {
    this.addGroup = function(type, name) {
        console.log('storage: add group');

        const uid = currentUser.getUid();

        let groupRef = '';
        if (type == 'category' || type == 'categories') {
            groupRef = '/categories/' + uid + '/';
        } else if (type == 'label' || type == 'labels') {
            groupRef = '/labels/' + uid + '/';
        } else {
            console.log('storage: type "' + type + '" not recognized');
            return;
        }

        const group = {
            name: name
        }

        fbConn.pushObject(groupRef, group);
    }

    this.updateGroup = function(type, group) {
        console.log('storage: update group');

        const uid = currentUser.getUid();

        let groupRef = '';
        if (type == 'category' || type == 'categories') {
            groupRef = '/categories/' + uid + '/' + group.id + '/';
        } else if (type == 'label' || type == 'labels') {
            groupRef = '/labels/' + uid + '/' + group.id + '/';
        } else {
            console.log('storage: type "' + type + '" not recognized');
            return;
        }

        let updates = {};
        updates[groupRef + 'id'] = group.id;
        updates[groupRef + 'name'] = group.name;

        // Remove all undefined fields
        updates = JSON.parse(JSON.stringify(updates));

        return fbConn.updateMultiple(updates).then(function() {
            return Promise.resolve(group);
        });
    }

    this.updateTrack = function(track) {
        console.log('storage: update track');

        const uid = currentUser.getUid();

        let updates = {};

        const trackRef = '/tracks/' + uid + '/' + track.id + '/';
        updates[trackRef + 'id'] = track.id;
        updates[trackRef + 'url'] = track.url;
        updates[trackRef + 'name'] = track.name;
        updates[trackRef + 'uploader'] = track.uploader.id;

        const uploaderRef = '/profiles/' + uid + '/' + track.uploader.id + '/';
        updates[uploaderRef + 'id'] = track.uploader.id;
        updates[uploaderRef + 'url'] = track.uploader.url;
        updates[uploaderRef + 'name'] = track.uploader.name;
        updates[uploaderRef + 'uploads/' + track.id] = true;

        if (track.repost != null) {
            const reposterRef = '/profiles/' + uid + '/' + track.repost.reposter.id + '/';
            if (track.repost.reposter.id !== track.uploader.id) {
                updates[reposterRef + 'id'] = track.repost.reposter.id;
                updates[reposterRef + 'url'] = track.repost.reposter.url;
                updates[reposterRef + 'name'] = track.repost.reposter.name;
            }
            updates[reposterRef + 'reposts/' + track.repost.id] = true;

            const repostRef = '/reposts/' + uid + '/' + track.repost.id + '/';
            updates[repostRef + 'id'] = track.repost.id;
            updates[repostRef + 'time'] = track.repost.time;
            updates[repostRef + 'reposter'] = track.repost.reposter.id;
            updates[repostRef + 'track'] = track.id;

            updates[trackRef + 'reposts/' + track.repost.id] = true;
        }

        // Remove all undefined fields
        updates = JSON.parse(JSON.stringify(updates));

        return fbConn.updateMultiple(updates).then(function() {
            return Promise.resolve(track);
        });
    };
}).apply(storage)
