package fr.vahren.life.desktop;

import com.badlogic.gdx.backends.lwjgl.LwjglApplication;
import com.badlogic.gdx.backends.lwjgl.LwjglApplicationConfiguration;
import fr.vahren.life.LifeApp;

public class DesktopLauncher {
	public static void main (String[] arg) {
		LwjglApplicationConfiguration config = new LwjglApplicationConfiguration();
		config.width = LifeApp.WIDTH;
		config.height = LifeApp.HEIGHT;
		new LwjglApplication(new LifeApp(), config);
	}
}
