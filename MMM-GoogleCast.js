Module.register("MMM-GoogleCast",{
	defaults: {
		device: null
	},

	getStyles: function() {
		return ["MMM-GoogleCast.css"];
	},

	getTranslations: function() {
		return {
			en: "translations/en.json",
      		es: "translations/es.json",
		};
	},

	// getHeight(element)
	// {
    // 	element.style.visibility = "hidden";
    // 	document.body.appendChild(element);
    // 	var height = element.clientHeight;
    // 	document.body.removeChild(element);
    // 	element.style.visibility = "visible";
    // 	return height;
	// },

	socketNotificationReceived: function(notification, payload) {
		if (payload.type == "deviceStatus")
		{
			this.app = payload.app;
			this.volume = payload.volume;
			if (this.app == null)
			{
				this.media = false;
			}
			this.updateDom();
		}
		else if (payload.type == "mediaStatus")
		{
			this.albumArtist = payload.albumArtist;
			this.image = payload.image;
			this.title = payload.title;
			this.state = payload.state;
			this.album = payload.album;
			this.artist = payload.artist;
			if (this.albumArtist == null && this.image == null && this.title == null && this.album == null && this.artist == null)
			{
				this.media = false;
			}
			else
			{
				this.media = true;
			}
			this.updateDom()
		}
		else if (payload.type == "status")
		{
			if (payload.message == "Device not found or unreachable")
			{
				this.unreachable = true;
				this.updateDom(3000);
			}
			else if (payload.message == "Cast.py loaded successfully")
			{				
				this.moduleLoaded = true;
				this.error = false;
			}
			// if (!this.moduleLoaded)
			// {
			// 	this.deviceName = payload.deviceName;
			// }
			else if (payload.message == "error")
			{
				this.error = true;
				this.moduleLoaded = false;
				this.updateDom(3000);
			}
		}
		else if (payload.type == "importError")
		{
			this.importError = true;
			this.updateDom(3000);
		}
	},

	getDom: function() {
		var main = document.createElement("div");
		if (!this.moduleLoaded)
		{
			var spinning = document.createElement("img");
			if (this.unreachable || this.importError || this.error)
			{
				spinning.src = this.file("icons/error.svg");
				spinning.style = "width: 30%; height: 30%; filter: invert(100%)";
				var message = document.createElement("p");
				message.style = "text-align: center; font-size: 15px";
				if (this.unreachable)
				{
					message.innerHTML = this.translate("nodev");		
				}
				else if (this.importError)
				{
					message.innerHTML = this.translate("importError");
				}
				else if (this.error)
				{
					message.innerHTML = this.translate("error");
				}
				main.appendChild(spinning);
				main.appendChild(message);
			}				
			else
			{
				spinning.src = this.file("icons/spinning.gif");
				spinning.style = "width: 40px; height: 40px";
				main.appendChild(spinning);
			}
			main.style = "text-align: center; line-height: 19px";		
		}	
		else
		{
			main.classList.add("main");
			var mediaDetails = document.createElement("div");
			var header = document.createElement("div");
			//
			header.classList.add("header");  
			var castIcon = document.createElement("img");
			castIcon.id = "cast-icon";
			var papp = document.createElement("p");
			papp.id = "app";
			if (this.app == null)
			{
				castIcon.src = this.file("icons/cast.svg");
				papp.innerHTML = this.translate("notConnected");
			}
			else
			{
				castIcon.src = this.file("icons/cast_connected.svg");
				papp.innerHTML = this.app;
			}
			header.appendChild(castIcon);
			header.appendChild(papp);
			// 
			var cover = document.createElement("div");
			var imagePlaceholder = document.createElement("img");
			if (!this.media || this.image == null)
			{
				imagePlaceholder.id = "notPlaying";
				imagePlaceholder.src = this.file("icons/library_music.svg");
			}
			else
			{
				imagePlaceholder.id = "albumCover";
				imagePlaceholder.src = this.image;
			}
			cover.appendChild(imagePlaceholder);
			//
			if (this.media)
			{
				if (this.title != null)
				{
					var mediaInfo = document.createElement("div");
					var musicNote = document.createElement("img");
					musicNote.src = this.file("icons/music_note.svg");
					var title = document.createElement("p");
					title.id = "title";
					title.innerHTML = this.title;
					mediaInfo.appendChild(musicNote);
					mediaInfo.appendChild(title);
				}
				if (this.album != null)		
				{
					var albumIcon = document.createElement("img");
					albumIcon.src = this.file("icons/album.svg");
					var album = document.createElement("p");
					album.id = "album";
					album.innerHTML = this.album;
					mediaInfo.appendChild(albumIcon);
					mediaInfo.appendChild(album);
				}
				if (this.artist != null)
				{
					var people = document.createElement("img");
					people.src = this.file("icons/people.svg");
					var artist = document.createElement("p");
					artist.id = "artist";
					artist.innerHTML = this.artist;
					mediaInfo.appendChild(people);
					mediaInfo.appendChild(artist);
				}
				if (this.albumArtist != null)
				{
					var person = document.createElement("img");
					person.src = this.file("icons/person.svg");
					person.style = "margin-top: 1px";
					var albumArtist = document.createElement("p");
					albumArtist.id = "albumArtist";
					albumArtist.innerHTML = this.albumArtist;
					mediaInfo.appendChild(person);
					mediaInfo.appendChild(albumArtist);
				}	
			}			
			//
			var deviceStatus = document.createElement("div");
			var statusIcon = document.createElement("img");
			statusIcon.style = "width: 50px; height: 50px; margin-top: 40%;	margin-bottom: 40%;	align-self: center;	margin-right: 5px; filter: invert(100%)";
			if (this.state == "PLAYING")
			{
				statusIcon.src = this.file("icons/play.svg");
			}
			else if (this.state == "IDLE")
			{
				statusIcon.src = this.file("icons/idle.svg");
			}
			else if (this.state == "BUFFERING")
			{
				statusIcon.src = this.file("icons/spinning.gif");
				statusIcon.style = "width: 50px; height: 50px; margin-top: 40%;	margin-bottom: 40%;	align-self: center;	margin-right: 5px";
			}
			else if (this.state == "PAUSED")
			{
				statusIcon.src = this.file("icons/pause.svg");
			}
			else if (!this.media)
			{
				statusIcon.style = "visibility: hidden";
			}
			deviceStatus.appendChild(statusIcon);
			var volumeDiv = document.createElement("div");
			volumeDiv.classList.add("volumeDiv");
			var volumeBar = document.createElement("div");
			if (this.volume == 0)
			{
				volumeBar.style = "visibility: hidden";
			}
			else
			{
				volumeBar.style = "background-color: white;	border: 4px solid white; vertical-align: bottom; border-radius: 5px; height: " + (this.volume * 100) + "%";
			}			
			volumeDiv.appendChild(volumeBar);
			deviceStatus.appendChild(volumeDiv);
			var volumeIcon = document.createElement("img");
			volumeIcon.classList.add("volumeIcon");
			if (this.volume == 0)
			{
				volumeIcon.src = this.file("icons/volume_muted.svg");
			}
			else if (this.volume <= 0.30)
			{
				volumeIcon.src = this.file("icons/volume_low.svg");
			}
			else if (this.volume <= 0.58)
			{
				volumeIcon.src = this.file("icons/volume_medium.svg");
			}
			else if (this.volume <= 0.85)
			{
				volumeIcon.src = this.file("icons/volume_high.svg");
			}
			else if (this.volume >= 0.85)
			{
				volumeIcon.src = this.file("icons/volume_insane.svg");
			}
			deviceStatus.appendChild(volumeIcon);
			// CSS styles to grid divs
			mediaDetails.classList.add("mediaDetails");			
			cover.classList.add("cover");			
			deviceStatus.classList.add("deviceStatus");
			// All the elements will be appended here
			mediaDetails.appendChild(header);
			mediaDetails.appendChild(cover);
			if (this.media)
			{
				mediaInfo.classList.add("mediaInfo");
				mediaDetails.appendChild(mediaInfo);
			}			
			main.appendChild(mediaDetails);
			main.appendChild(deviceStatus);
		}
		return main;
	},
	start: function() {
		this.moduleLoaded = false;
		this.importError = false;
		this.unreachable = false;
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}
});
