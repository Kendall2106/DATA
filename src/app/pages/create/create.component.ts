import { Component, OnInit } from '@angular/core';
import { FriendService } from 'src/app/core/service/friend.service';
import { ProfileService } from 'src/app/core/service/profile.service';
import { SettingsService } from 'src/app/core/service/settings.service';

// Pagina de ajustes: metas del año, amigo y color de la pagina
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  settings: any[] = [];
  loading: boolean = false;
  savedId: string = '';

  friend: any = null;
  friendInput: string = '';
  friendError: string = '';
  linking: boolean = false;

  colors: string[] = ['#ff6a13', '#7dff3a', '#2f9bff', '#b46bff', '#ff4d6d', '#ffd24a', '#ffffff'];
  colorActual: string = '#ff6a13';

  constructor(public settingsService: SettingsService, private friendService: FriendService, private profileService: ProfileService) {
  }

  ngOnInit(): void {
    const saved = localStorage.getItem('hobbies-color');
    const current = getComputedStyle(document.documentElement).getPropertyValue('--color-2').trim();
    this.colorActual = saved || current || this.colorActual;

    this.loadSettings();
    this.loadFriend();
  }

  // ---------- Metas del año ----------
  async loadSettings() {
    try {
      this.loading = true;
      this.settings = await this.settingsService.getSettings();
    } catch (error) {
      console.error('Error cargando los ajustes', error);
    } finally {
      this.loading = false;
    }
  }

  // "metaAnimes" o "meta_animes" se muestra como "Meta animes"
  prettyName(name: string): string {
    const text = (name ?? '').replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  step(setting: any, delta: number) {
    const next = Math.max(0, (Number(setting.value) || 0) + delta);
    setting.value = typeof setting.value === 'number' ? next : String(next);
    this.saveSetting(setting);
  }

  async saveSetting(setting: any) {
    try {
      await this.settingsService.updateSettings(setting.id, {
        value: setting.value
      });
      this.savedId = setting.id;
      setTimeout(() => {
        if (this.savedId === setting.id) {
          this.savedId = '';
        }
      }, 1800);
    } catch (error) {
      console.error('Error actualizando setting', error);
    }
  }

  // ---------- Amigo (se mantiene vinculado hasta que lo quites) ----------
  async loadFriend() {
    try {
      this.friend = await this.friendService.getFriend(true);
    } catch (error) {
      console.error('Error al cargar el amigo:', error);
    }
  }

  async linkFriend() {
    this.friendError = '';
    try {
      this.linking = true;
      await this.friendService.linkByUsername(this.friendInput);
      this.friendInput = '';
      await this.loadFriend();
    } catch (error: any) {
      this.friendError = error?.message ?? 'No se pudo vincular';
    } finally {
      this.linking = false;
    }
  }

  async unlinkFriend() {
    try {
      await this.friendService.unlink();
      this.friend = null;
    } catch (error) {
      console.error('Error al desvincular:', error);
    }
  }

  // ---------- Color de la pagina ----------
  setColor(color: string) {
    this.colorActual = color;
    this.profileService.saveColor(color);
  }

}
