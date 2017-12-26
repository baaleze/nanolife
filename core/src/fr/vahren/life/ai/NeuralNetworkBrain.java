package fr.vahren.life.ai;

import org.deeplearning4j.gym.StepReply;
import org.deeplearning4j.rl4j.learning.sync.qlearning.QLearning;
import org.deeplearning4j.rl4j.learning.sync.qlearning.discrete.QLearningDiscreteDense;
import org.deeplearning4j.rl4j.mdp.MDP;
import org.deeplearning4j.rl4j.network.dqn.DQNFactoryStdDense;
import org.deeplearning4j.rl4j.policy.DQNPolicy;
import org.deeplearning4j.rl4j.space.ArrayObservationSpace;
import org.deeplearning4j.rl4j.space.DiscreteSpace;
import org.deeplearning4j.rl4j.space.ObservationSpace;
import org.deeplearning4j.rl4j.util.DataManager;
import org.nd4j.linalg.cpu.nativecpu.NDArray;

import java.io.IOException;

public abstract class NeuralNetworkBrain extends Brain<State,Integer> implements MDP<State,Integer,DiscreteSpace> {

    public static QLearning.QLConfiguration QL =
            new QLearning.QLConfiguration(
                    123,    //Random seed
                    200,    //Max step By epoch
                    150000, //Max step
                    150000, //Max size of experience replay
                    32,     //size of batches
                    500,    //target update (hard)
                    10,     //num step noop warmup
                    0.01,   //reward scaling
                    0.99,   //gamma
                    1.0,    //td-error clipping
                    0.1f,   //min epsilon
                    1000,   //num step for eps greedy anneal
                    true    //double DQN
            );

    public static DQNFactoryStdDense.Configuration NET =
            DQNFactoryStdDense.Configuration.builder()
                    .l2(0.001).learningRate(0.0005).numHiddenNodes(16).numLayer(3).build();

    private QLearningDiscreteDense<State> learning;

    private void initBrain() throws IOException {
        DataManager manager = new DataManager(true);

        this.learning = new QLearningDiscreteDense<>(this, NET, QL, manager);

        learning.train();

    }

    @Override
    public Integer decide(State input) {
        return learning.getPolicy().nextAction(new NDArray(input.toArray()));
    }

    @Override
    public ObservationSpace<State> getObservationSpace() {
        // TODO
        return new ArrayObservationSpace<>(new int[] {1,2,3});
    }

    @Override
    public DiscreteSpace getActionSpace() {
        return new DiscreteSpace(Action.values().length);
    }

    @Override
    public State reset() {
        return new State();
    }

    @Override
    public void close() {
        // TODO
    }

    @Override
    public StepReply<State> step(Integer action) {
        // TODO
        return null;
    }

    @Override
    public boolean isDone() {
        // Done when it is dead TODO
        return false;
    }

    @Override
    public MDP<State, Integer, DiscreteSpace> newInstance() {
        // TODO
        return null;
    }

    enum Action {
        MOVE, BACK, ROTATE, GROW, EAT
    }

}
